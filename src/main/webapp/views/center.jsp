<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<style>
  .updown{
    width:30px;
  }
  #results{
    width: 200px;
    border:2px solid red;
  }
  .wh{
    width: 500px;
    border:2px solid greenyellow;
  }
</style>
<script>
  let center = {
    init:function(){
      let url = '/getdata';
      $.ajax({
        url:url,
        success:(data)=>{
          console.log(data);
          this.display(data);
        },
        error:()=>{}
      });

      setInterval(()=>{
        $.ajax({
          url:url,
          success:(data)=>{
            console.log(data);
            this.display(data);
          },
          error:()=>{}
        });
      },10000);

      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();

      if(month < 10){
        month = '0'+month;
      }
      if(day < 10){
        day = '0'+day;
      }

      let today = year+''+month+''+day+'0600';

      let wh1Url = 'http://apis.data.go.kr/1360000/MidFcstInfoService/getMidFcst'; /*URL*/
      let queryParams = '?' + encodeURIComponent('serviceKey') + '='+'C2YXvxKurZ%2FmXrbnFlyub5B89GCCWUmYncj4wvNqlWzyP0IwmeP%2FAVl1mU3Tz7Kzk8mfT3f6Wm2wJJ9Z6yNjgw%3D%3D'; /*Service Key*/
      queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /**/
      queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /**/
      queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('JSON'); /**/
      queryParams += '&' + encodeURIComponent('stnId') + '=' + encodeURIComponent('108'); /**/
      queryParams += '&' + encodeURIComponent('tmFc') + '=' + encodeURIComponent(today); /**/

      $.ajax({
        url: wh1Url+queryParams,
        success:(data)=>{
          console.log(data);
          let wh1Data = data.response.body.items.item[0].wfSv;
          $('#wh1').text(wh1Data);
        }
      });

    },
    display:(data)=>{
      // JSON [{},{}]
      let result = '';
      $(data).each((index,item)=>{
        let cnt = item.cnt;
        let title = item.title;
        let updown = item.updown;
        result += (updown == 1) ?
                '<p>'+cnt+' '+title+' '+'<img class="updown" src="/img/up.png">'+'</p>'
                : '<p>'+cnt+' '+title+' '+'<img class="updown" src="/img/down.png">'+'</p>';

      });
      $('#results').html(result);
    }
  }
  $().ready(()=>{
    center.init();
  });
</script>
<%-- Center Page --%>
<div class="col-sm-7">
  <h2>TITLE HEADING</h2>
  <h5>Title description, Sep 2, 2017</h5>
  <div class="wh" id="wh1"></div>
</div>
<div class="col-sm-3">
  <h4>실시간검색순위</h4>
  <div id="results"></div>
</div>