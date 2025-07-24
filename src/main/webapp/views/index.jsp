<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>




<!DOCTYPE html>
<html lang="ko">
<head>
  <title>Bootstrap 4 Website Example</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
  <script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
  <style>
    .fakeimg {
      height: 150px;
      background: #aaa;
    }
  </style>
  <script>
    let index = {
      init:function(){
        let url = '/gettime';
        $.ajax({
          url:url,
          success:(data)=>{
            $('#ctime').text(data);
          },
          error:()=>{}
        });
        setInterval(()=>{
          $.ajax({
            url:url,
            success:(data)=>{
              $('#ctime').text(data);
            },
            error:()=>{}
          });
        }, 1000);

      }
    }
    $().ready(()=>{
      index.init();
    });

  </script>
</head>
<body>
<ul class="nav justify-content-end">

  <c:choose>
    <c:when test="${sessionScope.logincust == null}">
      <li class="nav-item">
        <a class="nav-link" href="/login">Login</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/register">Register</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/about">About Us</a>
      </li>
    </c:when>
    <c:otherwise>
      <li class="nav-item">
        <a class="nav-link" href="/info">${sessionScope.logincust.custName}</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/logout">Logout</a>
      </li>
    </c:otherwise>
  </c:choose>


</ul>
<%-- Header Start --%>
<div class="jumbotron text-center" style="margin-bottom:0">
  <h1>HTML5 & JavaScript</h1>
  <p>HTML5, CSS, JavaScript, jQuery, AJAX</p>
  <p id="ctime"></p>
</div>
<%-- Header End --%>


<nav class="navbar navbar-expand-sm bg-dark navbar-dark">
  <a class="navbar-brand" href="/">Home</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="collapsibleNavbar">
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link" href="/html">HTML</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/css">CSS</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/js">JS</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/jq">JQuery</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/ajax">AJAX</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/productitem">ProductItem</a>
      </li>
      <c:if test="${sessionScope.logincust.custId == 'admin'}">
        <li class="nav-item">
          <a class="nav-link" href="/cust">Cust</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/product">Product</a>
        </li>
      </c:if>

    </ul>
  </div>
</nav>

<div class="container" style="margin-top:30px; margin-bottom: 30px;">
  <div class="row">
    <%-- Left Menu Start ........  --%>
    <c:choose>
      <c:when test="${left == null}">
        <jsp:include page="left.jsp"/>
      </c:when>
      <c:otherwise>
        <jsp:include page="${left}.jsp"/>
      </c:otherwise>
    </c:choose>

    <%-- Left Menu End ........  --%>
      <c:choose>
        <c:when test="${center == null}">
          <jsp:include page="center.jsp"/>
        </c:when>
        <c:otherwise>
          <jsp:include page="${center}.jsp"/>
        </c:otherwise>
      </c:choose>
    <%-- Center Start ........  --%>

    <%-- Center End ........  --%>
  </div>
</div>

<div class="text-center" style="background-color:black; color: white; margin-bottom:0; max-height: 50px;">
  <p>Footer</p>
</div>

</body>
</html>