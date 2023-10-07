class AppController extends SimpleTimezones {
  lastZoneData;
  constructor(){
    super();

    const t = this;
    $('div.main-container').mouseleave(function(){
      t.clearHighlight();
    });
  }
  init(){
    this.draw();
    this.initTimers();
  }
  async initTimers(){
    this.setTimes();
    let lastHour = this.lastZoneData[0].currentHour;
    await this.rapidCheck();
    while(true){
      if(lastHour === this.lastZoneData[0].currentHour){
        await this.waitMs(980);
        await this.rapidCheck();
      } else {
        await this.shift();
        await this.rapidCheck();
        lastHour = this.lastZoneData[0].currentHour
      }
    }
  }
  async rapidCheck(){
    return new Promise(async (resolve)=>{
      let lastSecond = this.lastZoneData[0].currentSecond;
      while(lastSecond === this.lastZoneData[0].currentSecond){
        await this.waitMs(4);
        this.setTimes();
      }
      resolve();
    });
  }
  async waitMs(ms){
    return new Promise((resolve)=>{
      setTimeout(() => {
        resolve();
      }, ms);
    })
  }
  draw(){
    if(this.zones.length === 0){
      this.addZone(this.defaultZone);
    }
    this.getZones().forEach((e,eidx)=>{
      let hours = '';
      e.data.forEach((h,hidx)=>{
        hours += `
          <div class="data-box box-sizing" data-slot="${hidx+1}">
            <span class="cell-date">${h.isNewDay || hidx === 0?`${h.month+1}/${h.date}`:''}</span>
            <span>${h.hour}</span>
            <span>${h.amPm}</span>
          </div>
        `;
      });
      $('div.zone-data-container').append(`
        <div class="zone-row">
          <div class="zone-entries">
            ${hours}
          </div>
        </div> 
      `);
      $('div.zone-info-container').append(`
        <div class="info-row box-sizing">
          <div>${e.timeZone} [${e.offset}]</div>
          <div id="zone-index-${eidx}">${e.currentTime}</div>
        </div> 
      `);
    });
    // Setup mouse actions
    const t = this;
    $('div.zone-entries div').mouseenter(function(e){
      let slot = $(this).data('slot');
      t.clearHighlight();
      $(`[data-slot=${slot}]`).addClass('highlighted');
    });
    // Setup emphasized hour
    this.emphasiseHour(this.offset);
    this.setTimes();
  }
  clear(){
    $('div.zone-data-container > div').not('.time-row').remove();
    $('div.zone-info-container > div').not('.time-row').remove();
  }
  redraw(){
    this.clear();
    this.draw();
  }
  emphasiseHour(hourPosition){
    $('.emphasise-hour').removeClass('emphasise-hour');
    $(`[data-slot=${hourPosition}]`).addClass('emphasise-hour');
  }
  clearHighlight(){
    $('.highlighted').removeClass('highlighted');
  }
  async shift(){
    this.emphasiseHour(this.offset+1);
    let animations = [];
    $('.zone-entries').each(async function(e){
      let element = $(this);
      let firstElement = $(element).children('.data-box:first');
      let lastElement = $(element).children('.data-box:last');
      animations.push(new Promise((resolve)=>{
        firstElement.animate({marginLeft: '-33px', opacity: 0 },500,()=>{resolve();});
      }));
      animations.push(new Promise((resolve)=>{
        lastElement.animate({ opacity: 1 },500,()=>{resolve();});
      }));
    });
    await Promise.all(animations);
    this.redraw();
  }
  setGradientAnimation(enabled){
    if(enabled && !$('body').hasClass('background-animation')){
      $('body').addClass('background-animation');
    }
    if(!enabled){
      $('body').removeClass('background-animation');
    }
  }
  setTimes(){
    this.lastZoneData = this.getZones();
    $('#main-time').text(this.lastZoneData[0].currentTime);
    $('#main-second').text(`:${this.lastZoneData[0].currentSecond}`);
    $('#main-am-pm').text(this.lastZoneData[0].currentAmPm);
    $('#main-month').text(this.lastZoneData[0].currentMonth);
    $('#main-date').text(this.lastZoneData[0].currentDate);
    $('#main-year').text(this.lastZoneData[0].currentYear);
    this.getZones().forEach((e,eidx)=>{
      $(`#zone-index-${eidx}`).text(`${e.currentTime} ${e.currentAmPm}`)
    });
  }
}