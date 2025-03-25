
var deg_div = 360 / 6;

function get_x(deg, rad){
    return "calc(cos("+ deg.toFixed(2) + "deg)*" + rad + " + 50%)";
}

function get_y(deg, rad){
    return "calc(sin("+ deg.toFixed(2) + "deg)*" + rad + " + 50%)";
}

/**
 * This function always work lower to higher range 
 *
 */

function slowFastSlowRange(begin, end, total_points){
      


   if(begin > end){
      throw new Error(`begin is greater than end.`);
   }
   let range_len = Math.abs( end - begin);//calculated the range length unit taken as 1

   /**
    *  Here it`s unit of the generated output range.
    */
   let unit_range = range_len/total_points;
   /**
    * If the points between range (0,$len) become scaled into the points 
    * between range (0,PI/2). Then 1 unit become to this unit.
    **/
   let unit_degree  = (Math.PI) / (total_points - 1); // in radian
   let output_range = [];

   /**
    * Here we first scale the points between (0, $len) to the points between (0, PI/2).
    * Then we passed the radian points to the COS function that scaled input points between
    * range (1,0).After that we get the scaled points back from it. 
    * Then we tried to get the points between the range (0,$range_len).
    */
   for (let i = 0; i < total_points; i++) {
      let radian_point        = unit_degree * i;
      let normalized_point    = parseFloat((Math.cos(radian_point)/2).toFixed(3))
      let scaled_point        = (normalized_point + 0.5) * total_points;
      let translated_point    = scaled_point * unit_range;
      let reverse_translated_point = range_len - translated_point;
      let original_point     = parseFloat((reverse_translated_point + begin).toFixed(3));
      output_range.push(original_point);
   }
   return output_range;
}
/** If 50 is passed, it creates range points like 0, 1, 2....
 *  If -50 is passed, it creates range points like 0, -1, -2...
 */
function easeInRange(num, total_points){

   let sfs_range = []; //sfs stands slow fast slow
   if(Math.sign(num) == -1){
     sfs_range = slowFastSlowRange(num, 0, total_points);
     sfs_range.reverse();
   }else{
     sfs_range = slowFastSlowRange(0, num, total_points);
   }
   return sfs_range;
}

function computeAnglesOffset( moveDeg, inputDegs = []){

    let outputDegs = [];
    let offset;
    if(
      moveDeg > 90 &&
      moveDeg < 270
    ){
      //  outputDegs = inputDegs.map((deg) => clockwiseMove(deg,moveDeg - 90));
        offset = 90 -  moveDeg;
    }
    if(
      moveDeg <= 90 &&
      moveDeg >= 0  
    ){
      //  outputDegs = inputDegs.map((deg) => antiClockwiseMove(deg,90 - moveDeg));
        offset = 90 - moveDeg;
    }
    if(
      moveDeg <= 360 &&
      moveDeg >= 270 
    ){
      //  console.log(moveDeg,(360 - moveDeg) + 90)
      //  outputDegs = inputDegs.map((deg) => antiClockwiseMove(deg,(360 - moveDeg) + 90));
        offset = (360 - moveDeg) + 90;
    }
    return offset;
   //  return outputDegs;
}

function animate({offset, duration,step,done}){

   if(
      offset   === undefined ||
      duration === undefined ||
      step     === undefined
   ){
      throw new Error('arguments may be missing');
   }
   var handler;
   var interval    = 120;
   var frame_count = Math.ceil(duration/interval);
   var callback_count = 0;
   var sfs_points  =  easeInRange( offset, frame_count);  

   handler = setInterval(function(callback, finalFn){
        if(callback_count === (frame_count - 1)){
           finalFn();
           clearInterval(handler);
        }
        callback( sfs_points[ callback_count]);
        callback_count++;
   },interval,step,done);
}

function multiCaller(){

}

$(document).ready(function(){

    var introCarouselElement = document.querySelector('#intro_carousel')
    var introCarousel = new bootstrap.Carousel(introCarouselElement, {
      wrap: false,
      cycle:false
    });
    var introCarouselIndex = 0;


    $('.btn-circle').each(function(i,obj){
        let btnAngle = i*deg_div + 90;
        if(btnAngle > 360){
          btnAngle = btnAngle % 360;
        }
        $(this).css('bottom',get_y( btnAngle, '50%'));
        $(this).css('left',get_x( btnAngle, '50%'));
        $(this).attr('deg', btnAngle);
    })

    $('.btn-circle').click(function(){
      
      let clk_btn_deg = parseFloat($(this).attr('deg'));
      var buttonAngles = [];
      $('.btn-circle').each(function(){
         buttonAngles.push( parseFloat($(this).attr('deg')));
      })

      var animateFns   = [];
      let angleOffset  = computeAnglesOffset(clk_btn_deg);
      var clkBtnHandle = this;

      $('.btn-circle').each(function( index ){
            var that    = this;
            var baseDeg = parseFloat($(this).attr('deg'));
            let fn = function() {
                  animate({
                     offset: angleOffset,
                     duration: 800,
                     step: function(addedDeg){
                        if(Math.sign(addedDeg) == -1){
                            let moveDeg = baseDeg + addedDeg < 0? 360 +baseDeg + addedDeg: baseDeg + addedDeg;
                            $(that).attr('deg',moveDeg);
                            $(that).css('left',get_x(moveDeg,'50%'));
                            $(that).css('bottom',get_y(moveDeg,'50%'));
                        }
                        if(Math.sign(addedDeg) == 1){
                           let moveDeg = baseDeg + addedDeg > 360? (baseDeg + addedDeg)%360 : baseDeg + addedDeg;
                           $(that).attr('deg',moveDeg);
                           $(that).css('left',get_x(moveDeg,'50%'));
                           $(that).css('bottom',get_y(moveDeg,'50%'));
                        }
                     },
                     done: function(){
                        let selfIndex = $(clkBtnHandle).index();
                        if(index === selfIndex){
                            $(that).addClass('btn-circle-active');
                        }else{
                            $(that).removeClass('btn-circle-active');
                        }
                     }
                  });
            }
            animateFns.push(fn);
      })
      animateFns.map((fn)=> fn());
    })

    $('.btn-circle').click(function(){
         let index = $(this).index();
         introCarousel.to(index);
    })
    function animateCore(){
       
      $({}).animate({ang:360},{
         duration:16000,
         easing:'linear',
         step: function(now){
            $('.circle-mid-2').css({transform:'rotate('+now+'deg)'})
         },
         complete: function(){
            animateCore();
         }
      })
    }
    animateCore();
})