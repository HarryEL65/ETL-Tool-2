import { JsonValidateService } from './../../../services/json-validate.service';
import { Globals } from './../../../utilities/globals';
import { JsonLockService } from './../../../services/json-lock.service';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { EtlAuthenticationService } from '../../../services/etl-authentication.service';
import { id } from '@swimlane/ngx-datatable/release/utils';
import { MediaQueriesService } from '../../../services/media-queries.service';

@Component({
  selector: 'wp-etl-json-like-view',
  templateUrl: './json-like-view.component.html',
  styleUrls: ['./json-like-view.component.scss']
})
export class JsonLikeViewComponent implements OnInit, OnChanges {


  isAdvancedMode;
  editorOptions: JsonEditorOptions;
  options = {
    mode: 'view'
  };
  configData;
  hasPermission = false;
  recordsType;
  recordType;
  isError;
  errorMessage;

  @ViewChild(JsonEditorComponent) editor: JsonEditorComponent;
  @Input() globalAccntData;
  @Input() mode;
  @Input() jsonLike;
  @Input() loadingIndicator;
  @Input() parentComp;
  @Input() manAccSelection;
  @Input() isNewJson: false;
  @Output() isJsonListLock = new EventEmitter<any>();
  mappingsKeyValue = [];
  configsKeyValue = [];
  lockedJson;

  cfgSingleKeyValues = [];
  navigationReportUrl;
  isSelected = false;
  isJasonSelected = false;

  constructor(private jsonLockSrv: JsonLockService,
    private jsonValidateServive: JsonValidateService,
    public authenticationService: EtlAuthenticationService,
    public globals: Globals,
    public mdqSrv: MediaQueriesService) { }

  ngOnInit() {

    this.authenticationService.hasPermission('edit_account').subscribe(res => {
      if (res) {
        this.setPermission(true);
        return;
      } else {
        this.setPermission(false);
        return;
      }
    });
    this.isAdvancedMode = false;

    if (this.jsonLike && !this.jsonLike.config) {
      this.extractData(this.jsonLike, 2);
    }

    this.jsonLockSrv.change.subscribe(isLock => {
      this.isJasonSelected = isLock;
    });

  }

  ngOnChanges(changes: SimpleChanges) {
    // tslint:disable-next-line:forin
    for (const propName in changes) {
      const change = changes[propName];

      if (changes['isNewJson']) {
        if (this.isNewJson) {
          this.jsonLike = this.manAccSelection;
          this.createEditor();
          this.recordsType = this.globals.recordsType;
          this.recordType = this.recordsType[0];
          this.configData = {};
        }
      } else if (changes['loadingIndicator']) {
        if (this.loadingIndicator) {
          this.isNewJson = false;
        }
      }
    }
  }

  setPermission(val: boolean) {
    this.hasPermission = val;
  }

  changeJsonMode() {
    this.isAdvancedMode = !this.isAdvancedMode;
    // necessary for retrieveing the changes in json when switching mode
    this.configData = this.jsonLike.config || this.jsonLike;
  }
  getData() {

    // retrieve the ID of the specific json edited.
    let editedRow, idx;
    const id = this.editor.jsonEditorContainer.nativeElement.parentElement.id;
    // console.log('editor id: ', id);
    try {

      const changedJson = this.editor.get();
      this.jsonLike.config = changedJson;
      if (this.recordType) {
        this.jsonLike.recordType = this.recordType.value;
        this.isJasonSelected = true;
        this.isJsonListLock.emit({ isLocked: this.isJasonSelected, jsonSlctn: this.jsonLike});
        this.jsonValidateServive.validate(true);
      }
      this.isError = false;
      this.errorMessage = null;

    } catch (e) {
      this.isJsonListLock.emit({ isLocked: false, jsonSlctn: this.jsonLike });
      this.isError = true;
      console.log(e.message);
      this.errorMessage = e.message;
      this.jsonValidateServive.validate(false);

    }
  }

  change(e) {
    console.log('Dev-------> change in json:' + this.editor);
    console.log(e);
    this.getData();
    this.applyJson();
  }

  updateDataToSend(e) {
    console.log(e);
    this.jsonLike.recordType = this.recordType.value;
  }

  createEditor() {
    this.editorOptions = new JsonEditorOptions();
    if (this.isNewJson) {
      this.hasPermission ? this.editorOptions.modes = ['code', 'text'] : this.editorOptions.modes = [];
      this.editorOptions.mode = 'code'; // set only one mode
    } else {
      this.hasPermission ? this.editorOptions.modes = ['view', 'tree'] : this.editorOptions.modes = [];
      this.editorOptions.mode = 'view'; // set only one mode
    }
    this.editorOptions.onChange = this.change.bind(this);
  }
  extractData(obj, mode?) {
    // this.jsonLikeView.extractData(this.selectedJsonLike.accID ? this.selectedJsonLike.config : this.selectedJsonLike);
    this.createEditor();
    if (this.isNewJson) {
      this.recordsType = this.globals.recordsType;
      this.recordType = this.recordsType[0];
      this.configData = {};
    } else {

      this.jsonLike = obj;
      if (this.jsonLike) {
        this.configData = this.jsonLike.config;
      }
      this.extractMapping(mode);
      this.extractAllConfig(mode);
    }

  }
  extractMapping(mode) {
    if (this.jsonLike) {
      this.mappingsKeyValue = [];

      const mapping = this.jsonLike.mapping || this.jsonLike.config.mapping;

      // tslint:disable-next-line:forin
      for (const key in mapping) {
        const value = mapping[key];
        // tslint:disable-next-line:forin
        for (const subKey in value) {
          const val = value[subKey];
          this.mappingsKeyValue.push({ 'key': subKey, 'value': val });
        }
      }
    }
  }
  extractAllConfig(mode?) {
    let config;
    if (this.jsonLike) {
      this.configsKeyValue = [];
      if(this.jsonLike.config) {
        config = JSON.parse(JSON.stringify(this.jsonLike.config));
      }
      // tslint:disable-next-line:forin
      for (const key in config) {
        if (typeof config[key] === 'string') {

          this.cfgSingleKeyValues.push({ 'key': key, 'value': config[key], type: 'string' });
          if (key === 'navigateReport') {
            this.navigationReportUrl = config[key];
          }

        } else if (Array.isArray(config[key])) {

          const value = config[key];
          this.configsKeyValue.push({ 'key': key, 'value': config[key], type: 'array' });
          // tslint:disable-next-line:forin
          for (const subKey in value) {
            // tslint:disable-next-line:forin
            for (const deepItem in config[key][subKey]) {
              config[key].push({ 'key': deepItem, 'value': config[key][subKey][deepItem], type: 'string' });
              // //            console.log('deepItem', deepItem);
            }
          }

        }
      }
    }
  }

  lockJson() {
    this.isJasonSelected = true;
    this.lockedJson = this.jsonLike;
    this.applyJson();
    this.jsonLockSrv.lock(true);
  }

  applyJson() {
    this.isJsonListLock.emit({ isLocked: this.isJasonSelected, jsonSlctn: this.jsonLike, 'spec': 'appyWhitDef' });
  }
  releaseJson() {
    this.isJasonSelected = false;
    this.jsonLike = this.lockedJson;
    this.isJsonListLock.emit({ isLocked: false, jsonSlctn: this.jsonLike });
    this.jsonLockSrv.lock(false);
  }


}
