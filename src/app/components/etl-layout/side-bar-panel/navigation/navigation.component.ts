import { MediaQueriesService } from './../../../../services/media-queries.service';
import {
  Component, OnInit, OnChanges, SimpleChanges,
  ViewChild, ElementRef, Input, Output,
  EventEmitter, AfterViewInit
} from '@angular/core';
import { Router, ActivatedRoute, Event } from '@angular/router';

import { Globals } from './../../../../utilities/globals';
import { EtlAuthenticationService } from '../../../../services/etl-authentication.service';
import { Location } from '@angular/common';
// import { ParentMenuService } from '../../../../services/parent-menu.service';

// New Menu Navigation
import { MenuService } from '../../../../services/menu.service';
import { NavItem } from '../../../../models/nav-item';
import { DataBody } from '../../../../models/data-body';
import { and } from '@angular/router/src/utils/collection';


@Component({
  selector: 'wp-etl-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})

export class NavigationComponent implements OnInit, AfterViewInit {

  // -----.cssClassHelper variables -------

  hasClass;
  addClass;
  removeClass;

  cssClassHelper
  isFirstTime = true;

  // ------ Menu Variables ----------
  currentMenu;
  menuEl;
  trigger;
  navElMenu;
  open = false;
  // level depth
  level;
  // the moving wrapper
  wrapper;
  // the mp-level elements
  levels;
  // save the depth of each of these mp-level elements

  // the menu items
  menuItems
  // if type == "cover" these will serve as hooks to move back to the previous level
  levelBack
  // event type (if mobile use touch events)
  eventtype

  defaults = {
    // overlap: there will be a gap between open levels
    // cover: the open levels will be on top of any previous open level
    type: 'overlap', // overlap || cover
    // space between each overlaped level
    levelSpacing: 40,
    // classname for the element (if any) that when clicked closes the current level
    backClass: 'mp-back'
  };

  // ---------------------------------


  oldSelection;
  hasAdminRole = false;
  hasPermission;
  navItems: NavItem[];
  route;

  // @Input() navItems: NavItem[];
  @Input() state: boolean;
  @Output() expand = new EventEmitter<any>();
  @ViewChild('check') check: HTMLInputElement;

  // ====== new inputs 
  // This param is an object with attributes that will overwrite the "default" 
  // options menu
  @Input() options;


  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    public globals: Globals,
    public mdqSrv: MediaQueriesService,
    location: Location,
    // public authSrv: EtlAuthenticationService,
    public menuService: MenuService) {

    router.events.subscribe((val) => {
      if (location.path() !== '') {
        this.route = location.path();
      }
    });

  }

  ngOnInit() {

    this.initCssClassHelper();
    this.getMenu();

  }

  ngAfterViewInit() {
    this.navElMenu = document.getElementById('mp-menu');
    this.options = this.extend(this.defaults, this.options);
    this._init();
    this.navigateTo(this.route);
  }


  getMenu(): void {
    this.navItems = this.menuService.getMenu();
  }
  
  setTooltip(text) {
    return this.state ? text : '';
  }
  getRouterLink(menuItem){
     let url=null;
    
     return menuItem.hasChildren? (this.router.url.indexOf(menuItem.path)==-1 ? url:this.router.url) : menuItem.path;

  }
  setRealUrl(menuItem) {
    return menuItem.hasChildren? menuItem.path : null;
  }
  navigateTo(route) {
    // after every refresh of the page simulate 
    // click on the menu until the relevant url location
    const segments = this.route.split('/');
    segments.reduce((acc, sgmt) => {
      if (sgmt !== '') {
        acc = acc + '/' + sgmt
        this.navElMenu.querySelectorAll('a').forEach((anchorEl) => {

          if (anchorEl.pathname == acc && anchorEl.pathname.indexOf(anchorEl.dataset.realurl)!==-1) {
            anchorEl.click();
            setTimeout( () =>  {
              if(!this.cssClassHelper.has(anchorEl, 'active')) {
                this.cssClassHelper.add(anchorEl, 'active');
              }
             }
              ,100);
          }else{  setTimeout( () =>  {
             if(this.cssClassHelper.has(anchorEl, 'active') && anchorEl.dataset.realurl.length>0) {// not home || rerun
                this.cssClassHelper.remove(anchorEl, 'active');
             } },100);
          }
        })
        return acc;
      }
      return;
    });

  }

  extend(a, b) {
    for (var key in b) {
      if (b.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }
    return a;
  }

  // taken from https://github.com/inuyaksa/jquery.nicescroll/blob/master/jquery.nicescroll.js
  hasParent(e, id) {
    if (!e) return false;
    var el = e.target || e.srcElement || e || false;
    while (el && el.id != id) {
      el = el.parentNode || false;
    }
    return (el !== false);
  }

  // returns the depth of the element "e" relative to element with id=id
  // for this calculation only parents with classname = waypoint are considered
  getLevelDepth(e, id, waypoint, cnt?) {
    cnt = cnt || 0;
    if (e.id.indexOf(id) >= 0) return cnt;
    if (this.cssClassHelper.has(e, waypoint)) {
      ++cnt;
    }
    return e.parentNode && this.getLevelDepth(e.parentNode, id, waypoint, cnt);
  }

  // http://coveroverflow.com/a/11381730/989439
  mobilecheck() {
    var check = false;
    (function (a) { if (/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true })(navigator.userAgent || navigator.vendor || window['opera']);
    return check;
  }

  // returns the this.closest element to 'e' that has class "classname"
  closest(e, classname) {
    if (this.cssClassHelper.has(e, classname)) {
      return e;
    }
    return e.parentNode && this.closest(e.parentNode, classname);
  }

  _init() {
    // if menu is open or not
    this.open = false;
    // level depth
    this.level = 0;
    // the moving wrapper
    this.wrapper = document.getElementById('mp-pusher');
    // the mp-level elements
    this.levels = Array.prototype.slice.call(this.navElMenu.querySelectorAll('div.mp-level'));
    // save the depth of each of these mp-level elements
    // var self = this;
    this.levels.forEach((el, i) => el.setAttribute('data-level', this.getLevelDepth(el, this.navElMenu.id, 'mp-level')));
    // the menu items
    this.menuItems = Array.prototype.slice.call(this.navElMenu.querySelectorAll('li'));
    // if type == "cover" these will serve as hooks to move back to the previous level
    this.levelBack = Array.prototype.slice.call(this.navElMenu.querySelectorAll('.' + this.options.backClass));
    // event type (if mobile use touch events)
    this.eventtype = this.mobilecheck() ? 'touchstart' : 'click';
    // add the class mp-overlap or mp-cover to the main element depending on options.type
    this.cssClassHelper.add(this.navElMenu, 'mp-' + this.options.type);
    // initialize / bind the necessary events
    this._initEvents();
  }

  _initEvents() {
    let self = this;

    // the menu should close if clicking somewhere on the body
    let bodyClickFn = function (el) {
      self._resetMenu();
      el.removeEventListener(self.eventtype, bodyClickFn);
    };

    this._openMenu();
    // opening a sub level menu
    this.menuItems.forEach(function (el, i) {
      // check if it has a sub level
      var subLevel = el.querySelector('div.mp-level');
      if (subLevel) {
        el.querySelector('a').addEventListener(self.eventtype, function (ev) {
          ev.preventDefault();
          var level = self.closest(el, 'mp-level').getAttribute('data-level');
          if (self.level <= level) {
            ev.stopPropagation();
            self.cssClassHelper.add(self.closest(el, 'mp-level'), 'mp-level-overlay');
            self._openMenu(subLevel);
          }
        });
      }
    });

    // closing the sub levels :
    // by clicking on the visible part of the level element
    this.levels.forEach(function (el, i) {
      el.addEventListener(self.eventtype, function (ev) {
        ev.stopPropagation();
        var level = el.getAttribute('data-level');
        if (self.level > level) {
          self.level = level;
          self._closeMenu();
        } else {
          self.navElMenu.querySelectorAll(".mp-level-open:not(.mp-level-overlay)>ul>li>a").forEach( anchorEl => {
            if(anchorEl.pathname===self.router.url && anchorEl.dataset.realurl === ""){
              setTimeout( () =>  {
                if(!self.cssClassHelper.has(anchorEl, 'active')) {
                  self.cssClassHelper.add(anchorEl, 'active');
                }
               })
            } else if( anchorEl.pathname===self.router.url && anchorEl.dataset.realurl !== "") {
              if(self.cssClassHelper.has(anchorEl, 'active')) {
                self.cssClassHelper.remove(anchorEl, 'active');
              }
            }
          });
          // 
        }

      });
    });

    // by clicking on a specific element
    this.levelBack.forEach(function (el, i) {
      el.addEventListener(self.eventtype, function (ev) {
        ev.preventDefault();
        var level = self.closest(el, 'mp-level').getAttribute('data-level');
        if (self.level <= level) {
          ev.stopPropagation();
          self.level = self.closest(el, 'mp-level').getAttribute('data-level') - 1;
          self.level === 0 ? self._resetMenu() : self._closeMenu();
        }
      });
    });
  };


  _openMenu(subLevel?) {
    // increment level depth
    ++this.level;

    // move the main wrapper
    var levelFactor = (this.level - 1) * this.options.levelSpacing,
      translateVal = this.options.type === 'overlap' ? this.navElMenu.offsetWidth + levelFactor : this.navElMenu.offsetWidth;

    this._setTransform('translate3d(' + translateVal + 'px,0,0)');

    if (subLevel) {
      // reset transform for sublevel
      this._setTransform('', subLevel);
      // need to reset the translate value for the level menus that have the same level depth and are not open
      for (var i = 0, len = this.levels.length; i < len; ++i) {
        var levelEl = this.levels[i];
        if (levelEl != subLevel && !this.cssClassHelper.has(levelEl, 'mp-level-open')) {
          this._setTransform('translate3d(-100%,0,0) translate3d(' + -1 * levelFactor + 'px,0,0)', levelEl);
        }
      }
    }
    // add class mp-pushed to main wrapper if opening the first time
    if (this.level === 1) {
      this.cssClassHelper.add(this.wrapper, 'mp-pushed');
      this.open = true;
    }
    // add class mp-level-open to the opening level element
    this.cssClassHelper.add(subLevel || this.levels[0], 'mp-level-open');
  };


  // close the menu
  _resetMenu() {
    this._setTransform('translate3d(0,0,0)');
    this.level = 0;
    // remove class mp-pushed from main wrapper
    this.cssClassHelper.remove(this.wrapper, 'mp-pushed');
    this._toggleLevels();
    this.open = false;
  };
  // close sub menus
  _closeMenu() {
    let translateVal = this.options.type === 'overlap' ? this.navElMenu.offsetWidth + (this.level - 1) * this.options.levelSpacing : this.navElMenu.offsetWidth;
    this._setTransform('translate3d(' + translateVal + 'px,0,0)');
    this._toggleLevels();
    this.navElMenu.querySelectorAll(".mp-level-open:not(.mp-level-overlay)>ul>li>a").forEach( anchorEl => {
      anchorEl.querySelector('span.mp-next')
      if(anchorEl.pathname===this.router.url && !anchorEl.querySelector('span.mp-next')){
        setTimeout( () =>  {
          if(!this.cssClassHelper.has(anchorEl, 'active')) {
            this.cssClassHelper.add(anchorEl, 'active');
          }
         })
      }
    });
  };
  // translate the el
  _setTransform(val, el?) {
    el = el || this.wrapper;
    el.style.WebkitTransform = val;
    el.style.MozTransform = val;
    el.style.transform = val;
  };
  // removes classes mp-level-open from closing levels
  _toggleLevels() {
    for (var i = 0, len = this.levels.length; i < len; ++i) {
      var levelEl = this.levels[i];
      if (levelEl.getAttribute('data-level') >= this.level + 1) {
        this.cssClassHelper.remove(levelEl, 'mp-level-open');
        this.cssClassHelper.remove(levelEl, 'mp-level-overlay');
      }
      else if (Number(levelEl.getAttribute('data-level')) == this.level) {
        this.cssClassHelper.remove(levelEl, 'mp-level-overlay');
      }
    }
  }

  classReg(className) {
    return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
  }

  initCssClassHelper() {

    if ('classList' in document.documentElement) {
      this.hasClass = function (elem, c) {
        return elem.classList.contains(c);
      };
      this.addClass = function (elem, c) {
        elem.classList.add(c);
      };
      this.removeClass = function (elem, c) {
        elem.classList.remove(c);
      };
    }
    else {
      this.hasClass = function (elem, c) {
        return this.classReg(c).test(elem.className);
      };
      this.addClass = function (elem, c) {
        if (!this.hasClass(elem, c)) {
          elem.className = elem.className + ' ' + c;
        }
      };
      this.removeClass = function (elem, c) {
        elem.className = elem.className.replace(this.classReg(c), ' ');
      };
    }

    this.cssClassHelper = {
      // full names
      hasClass: this.hasClass,
      addClass: this.addClass,
      removeClass: this.removeClass,
      toggleClass: this.toggleClass,
      // short names
      has: this.hasClass,
      add: this.addClass,
      remove: this.removeClass,
      toggle: this.toggleClass
    };

  }

  toggleClass(elem, c) {
    var fn = this.hasClass(elem, c) ? this.removeClass : this.addClass;
    fn(elem, c);
  }


}

