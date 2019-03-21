import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable()
export class MediaQueriesService {
  XS;
  SM; 
  LG;
  MD;
  XL;

  @Output() mediaQueryChange = new EventEmitter();

  mediaQueriesList = [
    { xs: window.matchMedia('(max-width: 480px)') },
    { sm: window.matchMedia('(min-width: 481px) and (max-width: 767px)') },
    // { mdlds: window.matchMedia('(min-width: 768px) and (max-width: 1024px) and (orientation: landscape)')},
    { md: window.matchMedia('(min-width: 768px) and (max-width: 1024px)') },
    { lg: window.matchMedia('(min-width: 1025px) and (max-width: 1280px)') },
    { xl: window.matchMedia('(min-width: 1281px)') }
  ];

  mqBreakPoint = [
    { XS: false, media: '(max-width: 480px)' },
    { SM: false, media: '(max-width: 767px) and (min-width: 481px)' },
    // { MDLDS: false, media: '(orientation: landscape) and (max-width: 1024px) and (min-width: 768px)'},
    { MD: false, media: '(max-width: 1024px) and (min-width: 768px)' },
    { LG: false, media: '(max-width: 1280px) and (min-width: 1025px)' },
    { XL: false, media: '(min-width: 1281px)' }
  ];

  
  constructor() { 
    this.XS = this.mqBreakPoint[0]['XS'];
    this.SM = this.mqBreakPoint[1]['SM'];
    this.MD = this.mqBreakPoint[2]['MD'];
    this.LG = this.mqBreakPoint[3]['LG'];
    this.XL = this.mqBreakPoint[4]['XL'];
  }


  mediaQueryResponse($event) {
    // console.log('media', $media);
    /* sm: {matches:true, media:'(min-width: 544px)',onchange:null */
    this.mediaQueriesList.filter((mediaQuery) => {
      if ($event.media === mediaQuery[Object.keys(mediaQuery)[0]].media) {
        // console.log('mediaQuery', mediaQuery);
        this.setActiveBreakPoint($event.media, $event.matches);
      }
    });
  }

  initMediaQueries() {

    this.mediaQueriesList.map(mq => {
      // if ( bp.media === media ) {
      // console.log(mq[Object.keys(mq)[0]]);
      if (mq[Object.keys(mq)[0]].matches) {
        this.mqBreakPoint.map(bp => {
          if (bp.media === mq[Object.keys(mq)[0]].media) {
            bp[Object.keys(bp)[0]] = true;
            window.setTimeout(() => {
              this.setActiveBreakPoint(mq[Object.keys(mq)[0]].media, true);
            }, 500);
            return;
          }
        });
      }
    });
    this.mediaQueriesList.map((media) => {
      // this.mediaQueryResponse(media); // call listener function explicitly at run time
      // tslint:disable-next-line:max-line-length
      // attach listener function to listen in on state changes
      media[Object.keys(media)[0]].addListener(evt => this.mediaQueryResponse(evt)); 
    });
  }

  
  setActiveBreakPoint(media, isActive) {
    let _that = this;
    // console.log('mqBreakPoint before ', this.mqBreakPoint);
    this.mqBreakPoint.map(bp => {
      if (bp.media === media) {
        bp[Object.keys(bp)[0]] = isActive;
        _that[Object.keys(bp)[0]] = isActive;
        this.mediaQueryChange.emit(Object.keys(bp)[0]); // emit XL, SM, LG, MD, XS
      }
    });
  }
}
