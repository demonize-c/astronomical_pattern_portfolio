
var deg_div = 360 / 5;

function get_x(deg, rad){
    return "calc(cos("+ deg.toFixed(2) + "deg)*" + rad + " + 50%)";
}

function get_y(deg, rad){
    return "calc(sin("+ deg.toFixed(2) + "deg)*" + rad + " + 50%)";
}


function slowFastSlowRange(begin, end, total_points){
      
   let range_len = Math.abs( end - begin);//calculated the range length unit taken as 1

   /**
    * If we find range length is greater than passed length,
    * then we can`t scale the points to be fall into ranges like (0,1) or (1,0).
    */
   if(range_len > total_points){
      throw Error(`range length-${range_len} is greater than passed length-${total_points}`);
   }
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

function slowFastSlowRangeMod(begin, end, total_points){

   let sfs_range = []; //sfs stands slow fast slow
   if(begin > end){
   sfs_range = slowFastSlowRange(end, begin, total_points);
   sfs_range.reverse();
   }else{
   sfs_range = slowFastSlowRange(begin, end, total_points);
   }
   return sfs_range;
}


function filter_deg_clockwise( deg, add){
   let eval = deg + add;
   if(eval < 0){
     return 360 - Math.abs(eval);
   }
   return eval;
}
/*
function rotate_menu_to(that){
   let btn_deg = parseFloat($(that).attr('deg'));
   let diff_deg;
   if(
     (btn_deg < 270  && btn_deg > 90)
   ){
     diff_deg = '-=' + (btn_deg - 90);
   }
//    $('.btn-circle').each(function( index ){
//     let deg = filter_deg_clockwise(parseFloat($(this).attr('deg')), diff_deg);
//     console.log(deg)
//     // $(this).css('bottom',get_y(deg, '50%'));
//     // $(this).css('left',get_x(deg,'50%'));
//     // $(this).attr('deg',deg)
//    })
   var stored_degs = [];
   var test_arr = new Array(5);
   var test_arr_1 = new Array(5);

   $('.btn-circle').each(function( index ){
       let deg = parseFloat($(this).attr('deg'));
       stored_degs.push(deg);
   });

   $(that).animate({
      pass_diff_deg: diff_deg
   },{
      step: function( now ){
         $('.btn-circle').each(function( index ){
            if(now >= diff_deg){
                let rot_deg  = filter_deg_clockwise(stored_degs[index], now);
                $(this).css('bottom',get_y(rot_deg, '50%'));
                $(this).css('left',get_x(rot_deg,'50%'));
                $(this).attr('deg',rot_deg.toFixed(2));
                test_arr[index] = rot_deg;
                test_arr_1[index] = now
            }
         })
      },
      complete: function(){
            // $('.btn-circle').each(function( index ){
            //     let rot_deg  = filter_deg_clockwise(stored_degs[index], now);
            //     $(this).css('bottom',get_y(rot_deg, '50%'));
            //     $(this).css('left',get_x(rot_deg,'50%'));
            //     $(this).attr('deg',rot_deg);
            //     console.log(rot_deg);
            // })
            console.log(btn_deg,diff_deg, test_arr,test_arr_1)
      }
   })
// console.log(diff_deg)
}
*/
$(document).ready(function(){

    // var i=0;
    // $('.btn-circle').click(function(){
    //     $(this).animate({
    //         oldRadius:'-=50'
    //     },{
    //         duration: 1000,
    //         step: function(now,fx){
    //             // let currentRedius = 50 + now;
    //             // console.log($(fx.elem).css('transform'));
    //             // $(this).css('bottom','calc(sin(0deg)*' + currentRedius + '% + 50%)');
    //             // $(this).css('left','calc(cos(0deg)*' + currentRedius + '% + 50%)');
    //             window.getComputedStyle(fx.elem);
    // const matrix = new DOMMatrix(style.transform);
    // console.log(matrix)
    //         }
    //     });
    // });
    // var circleBtns = [];
   //  $('.btn-circle').each(function(i,obj){
   //      $(this).css('bottom',get_y( i * deg_div, '50%'));
   //      $(this).css('left',get_x( i * deg_div, '50%'));
   //      $(this).attr('deg', i * deg_div);
   //  })
   //  let arr = new Array(50);
   //  let div = 90/50;
   //  arr.fill(1)
   //  arr = arr.map(function(val, i){
   //       return (div * i) * (Math.PI/180);
   //  })
   //  arr=arr.map(function(val, i){
   //    return Math.sin(val) * 50;
   //  })
   //  console.log(arr)


   // function animate({begin, end, duration,callback}){

   //    var handler;
   //    let callback_count = Math.abs(end - begin);
   //    let interval = duration/callback_count;
   //    if(callback)
   //    handler = setInterval(function(){

   //    },interval);
   // }


   //50 0
   



    console.log(slowFastSlowRangeMod(50,0,50));
    

    // $('.btn-circle').click(function(){
    //     // var index = $(this).index();
    //     // $(this).animate({
    //     //     old_radius:'50',
    //     // },{
    //     //    step: function( now ){
    //     //       let curr_redius = 50 - now;
    //     //       if(curr_redius >= 0){
    //     //           $(this).css('bottom',get_y(index * deg_div, '' + curr_redius + '%'));
    //     //           $(this).css('left',get_x(index * deg_div, '' + curr_redius + '%'));
    //     //       }
    //     //    }
    //     // });
    //     // let btn_deg = index * deg_div;
    //     rotate_menu_to(this)
    // })
})