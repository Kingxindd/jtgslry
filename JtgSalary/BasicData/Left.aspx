﻿<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Left.aspx.cs" Inherits="JtgTMS.BasicData.Left" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <meta charset="utf-8">
    <script language="javascript" src="/SiteFiles/bairong/jquery/jquery-1.8.3.min.js"></script>
    <script language="javascript" src="/SiteFiles/bairong/scripts/datepicker/wdatepicker.js"></script>

    <link rel="stylesheet" type="text/css" href="/SiteFiles/bairong/jquery/bootstrap/css/bootstrap.min.css">
    <script language="javascript" src="/SiteFiles/bairong/jquery/bootstrap/js/bootstrap.min.js"></script>
    <!--[if lte IE 6]>
    <link rel="stylesheet" type="text/css" href="/SiteFiles/bairong/jquery/bootstrap/ie/bootstrap-ie6.min.css">
    <script type="text/javascript" src="/SiteFiles/bairong/jquery/bootstrap/ie/bootstrap-ie.js"></script>
    <![endif]-->
    <!--[if lte IE 7]>
    <link rel="stylesheet" type="text/css" href="/SiteFiles/bairong/jquery/bootstrap/ie/ie.css">
    <![endif]-->
    <script type="text/javascript">
    (function ($) {
        $(document).ready(function() {
            if ($.isFunction($.bootstrapIE6)) $.bootstrapIE6($(document));
        });
    })(jQuery);
    </script>

    <!--[if lt IE 9]><script src="/SiteFiles/bairong/jquery/html5shiv/html5shiv.js"></script><![endif]-->

    <link rel="stylesheet" href="../inc/style.css" type="text/css" />
    <script language="javascript" src="../inc/script.js"></script>
</head>
<body>
    <style type="text/css">
        body { padding:0; margin:0; }
        .container,.dropdown,.dropdown-menu {margin-left: 6px; float: none;}
        .navbar, .navbar-inner, .nav{margin-bottom: 5px; padding:0; }
        .dropdown,.dropdown-toggle{width:100%}
        .navbar-inner {height: 35px; min-height: 35px;}
        .table-condensed td {padding:2px 5px;}
        </style>
        <!--[if IE]>
        <style type="text/css">
        .navbar-inner {height: 40px; min-height: 40px;}
        .dropdown {margin-left: 0;}
        </style>
        <![endif]--> 
        
    <form id="form1" runat="server">
    <div class="container" style="height:50px;width:153px;">
        <div class="navbar navbar-fixed-top">
          <div class="navbar-inner">
  	        <ul class="nav">
	          <li><a href="#" style="font-size:14px; padding-left:20px;">基础数据</a></li>
	        </ul>
          </div>
        </div>
    </div>
      <table class="table table-condensed noborder table-hover">
        <tr style='display:' id="trFunc61" runat="server" treeItemLevel='1'>
	        <td nowrap>
		        <img align="absmiddle" style="cursor:pointer;" onClick="displayChildren(this);" isOpen="true" src="/sitefiles/bairong/icons/tree/minus.gif"/><img align="absmiddle" src="/sitefiles/bairong/Icons/menu/forum.gif"/>&nbsp;基础数据
	        </td>
        </tr>

        <tr style='display:' id="trFunc611" runat="server" treeItemLevel='2'>
	        <td nowrap>
		        <img align="absmiddle" src="/sitefiles/bairong/icons/tree/empty.gif"/><img align="absmiddle" src="/sitefiles/bairong/icons/tree/empty.gif"/><img align="absmiddle" src="/sitefiles/bairong/icons/menu/item.gif"/>&nbsp;<a href='/BasicData/ToolCategory_Frame.aspx' target='right' onclick='openFolderByA(this);' isTreeLink='true'>工具分类</a>
	        </td>
        </tr>

        <tr style='display:' id="trFunc612" runat="server" treeItemLevel='2'>
	        <td nowrap>
		        <img align="absmiddle" src="/sitefiles/bairong/icons/tree/empty.gif"/><img align="absmiddle" src="/sitefiles/bairong/icons/tree/empty.gif"/><img align="absmiddle" src="/sitefiles/bairong/icons/menu/item.gif"/>&nbsp;<a href='/BasicData/Tool_Frame.aspx' target='right' onclick='openFolderByA(this);' isTreeLink='true'>工具档案</a>
	        </td>
        </tr>
        
        <tr style='display:' id="trFunc613" runat="server" treeItemLevel='2'>
	        <td nowrap>
		        <img align="absmiddle" src="/sitefiles/bairong/icons/tree/empty.gif"/><img align="absmiddle" src="/sitefiles/bairong/icons/tree/empty.gif"/><img align="absmiddle" src="/sitefiles/bairong/icons/menu/item.gif"/>&nbsp;<a href='/BasicData/PackTool_Fram.aspx' target='right' onclick='openFolderByA(this);' isTreeLink='true'>组合工具</a>
	        </td>
        </tr>
        
        <tr style='display:' id="trFunc614" runat="server" treeItemLevel='2'>
	        <td nowrap>
		        <img align="absmiddle" src="/sitefiles/bairong/icons/tree/empty.gif"/><img align="absmiddle" src="/sitefiles/bairong/icons/tree/empty.gif"/><img align="absmiddle" src="/sitefiles/bairong/icons/menu/item.gif"/>&nbsp;<a href='/BasicData/BasicDictionaries_Fram.aspx' target='right' onclick='openFolderByA(this);' isTreeLink='true'>基础字典</a>
	        </td>
        </tr>
        
        
        <tr style='display:' id="tr1" runat="server" treeItemLevel='2'>
	        <td nowrap>
		        <img align="absmiddle" src="/sitefiles/bairong/icons/tree/empty.gif"/><img align="absmiddle" src="/sitefiles/bairong/icons/tree/empty.gif"/><img align="absmiddle" src="/sitefiles/bairong/icons/menu/item.gif"/>&nbsp;<a href='/BasicData/ToolLocation_Frame.aspx' target='right' onclick='openFolderByA(this);' isTreeLink='true'>工具初始化</a>
	        </td>
        </tr>
        
        <tr style='display:' id="tr2" runat="server" treeItemLevel='2'>
	        <td nowrap>
		        <img align="absmiddle" src="/sitefiles/bairong/icons/tree/empty.gif"/><img align="absmiddle" src="/sitefiles/bairong/icons/tree/empty.gif"/><img align="absmiddle" src="/sitefiles/bairong/icons/menu/item.gif"/>&nbsp;<a href='/BasicData/PrefixCode_Lst.aspx' target='right' onclick='openFolderByA(this);' isTreeLink='true'>单号前缀</a>
	        </td>
        </tr>
      </table>
    </form>
    <script>
        window.top.frames["right"].location.href = "../Platform/framework_right.aspx";
    </script>
</body>
</html>
