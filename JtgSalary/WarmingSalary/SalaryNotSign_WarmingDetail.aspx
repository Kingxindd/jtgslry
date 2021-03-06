﻿<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="SalaryNotSign_WarmingDetail.aspx.cs" Inherits="JtgTMS.WarmingSalary.SalaryNotSign_WarmingDetail" EnableEventValidation="false" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <meta charset="utf-8">
    <script language="javascript" src="/SiteFiles/bairong/jquery/jquery-1.8.3.min.js"></script>
    <script language="javascript" src="/SiteFiles/bairong/scripts/datepicker/wdatepicker.js"></script>

    <link rel="stylesheet" type="text/css" href="/SiteFiles/bairong/jquery/bootstrap/css/bootstrap.min.css">
    <script language="javascript" src="/SiteFiles/bairong/jquery/bootstrap/js/bootstrap.min.js"></script>
    
    <script type="text/javascript" src="../scripts/jquery.js"></script>
    <script type="text/javascript" src="../scripts/jquery-ui-1.8.11.custom.js"></script>
    <script type="text/javascript" src="../scripts/jquery.DOMWindow.js"></script>
    
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
    
    <script type="text/javascript">
        function refSalaryWindow() {
            
        }

        function PopSalaryInfo(_this, _id) {
            $(_this).openDOMWindow({
                width: 900,
                height: 600,
                borderSize: 1,
                draggable: 1,
                borderColor: '#6D0413',
                overlayColor: '#ccc',
                overlayOpacity: '60',
                modal: 1,
                windowSource: 'iframe',
                windowSourceURL: '../PersonSalary/UserSalary_Info.aspx?UserSalaryID=' + _id.toString(),
                windowPadding: 0
            });
            return false;
        }

        function PopUserInfoChoice(_this) {
            $(_this).openDOMWindow({
                width: 880,
                height: 500,
                borderSize: 1,
                draggable: 1,
                borderColor: '#6D0413',
                overlayColor: '#ccc',
                overlayOpacity: '60',
                modal: 1,
                windowSource: 'iframe',
                windowSourceURL: '../Admin/UserInfo_Choice.aspx',
                windowPadding: 0
            });
            return false;
        }

        function SalarySelected() {
            document.getElementById("btnSalarys").click();
            //alert(document.getElementById("txtSalaryYears").value);
        }

        //Add by lk 20151214 start
        function SalarySelected2() {
            document.getElementById("btnSalarys2").click();
            //alert(document.getElementById("txtSalaryYears").value);
        }
        function refUserWindow() {
            document.getElementById("btnChoiceUser").click();
        }        
        //Add by lk 20151214 end
    </script>
</head>
<body>

<form id="upForm" name="ctl00" class="form-inline" runat="server">
  <ul class="breadcrumb" style="display:none"><li>段工资签收 <span class="divider">/</span></li><li>工具领用领用</ul>

  <script type="text/javascript">
      $(document).ready(function() {
      loopRows(document.getElementById('gvLists'), function(cur) { cur.onclick = chkSelect; });
          $(".popover-hover").popover({ trigger: 'hover', html: true });
      });
  </script>
    <ajaxToolkit:ToolkitScriptManager ID="ToolkitScriptManager1" runat="server">
            </ajaxToolkit:ToolkitScriptManager>
        <asp:UpdatePanel ID="UpdatePanel1" runat="server">
            <Triggers>
               <asp:PostBackTrigger ControlID="btnExport" />
            </Triggers>
            <ContentTemplate>
                <div class="well well-small">
                <table class="table table-noborder">
                  <tr>
                    <td width="70">
                        员工：
                    </td>
                    <td width="330">
                        <asp:TextBox ID="txtUserSalaryOpCode" Width="120px" runat="server" AutoPostBack="true"
                                        ontextchanged="txtUserSalaryOpCode_TextChanged"></asp:TextBox>
                        <ajaxToolkit:AutoCompleteExtender ID="txtCostName_AutoCompleteExtender" 
                                        runat="server" Enabled="True" 
                                        ServiceMethod="GetCompleteList" ServicePath="../WebService/GetSelfUserLst.asmx" 
                                        TargetControlID="txtUserSalaryOpCode" CompletionSetCount="100" MinimumPrefixLength="0"
                                        CompletionInterval="100">
                                    </ajaxToolkit:AutoCompleteExtender>
                        <asp:TextBox ID="txtUserSalaryOpName" Width="130px" Enabled="false" runat="server"></asp:TextBox>
                        <asp:TextBox ID="txtUserSalaryUserID" Text="0" Visible="false" runat="server"></asp:TextBox>
                        <asp:ImageButton ID="btnSearchOpCode" ImageUrl="../pic/icon/help.gif" OnClientClick="return PopUserInfoChoice(this);"
                            runat="server" />
                    </td>
                    <td>
                      <asp:Button ID="btnSearch" CssClass="btn" Text="搜 索" runat="server" TabIndex="0" onclick="btnSearch_Click" />
                      
                      <asp:Button ID="btnExport" Text="导出Excel" CssClass="btn" 
                      runat="server" onclick="btnExport_Click"/>
                    </td>
                  </tr>
                  
                </table>
              </div>              
                <asp:GridView ID="gvLists" name="contents" runat="server" CssClass="table table-bordered info table-hover" FooterStyle-ForeColor="Red"  GridLines="none"
                    AutoGenerateColumns="False" DataKeyNames="ID" OnRowDataBound="gvLists_RowDataBound">
                    <HeaderStyle CssClass="info thead" />                 
                    <EmptyDataTemplate>
                           工资单为空。
                    </EmptyDataTemplate>
                    <Columns>
                        <asp:TemplateField HeaderText="">                                          
                            <ItemTemplate>
                                <%#Container.DataItemIndex+1 %>
                            </ItemTemplate>
                            <ItemStyle Width="3%"/>
                        </asp:TemplateField>
                         <asp:TemplateField HeaderText="工号">
                            <ItemTemplate>
                                <%# Eval("OpCode").ToString()%>
                            </ItemTemplate>
                            <HeaderStyle Width="10%"/>
                        </asp:TemplateField>
                        <asp:TemplateField HeaderText="姓名">
                            <ItemTemplate>
                                <%# Eval("OpName").ToString()%>
                            </ItemTemplate>
                            <HeaderStyle Width="10%"/>
                        </asp:TemplateField>
                        <asp:TemplateField HeaderText="单位部门">
                            <ItemTemplate>
                                <%# Eval("OrganName").ToString()%>
                            </ItemTemplate>
                            <HeaderStyle Width="10%"/>
                        </asp:TemplateField>
                        <asp:TemplateField HeaderText="工资年月">
                            <ItemTemplate>
                                <%# Eval("SalaryYears").ToString()%>
                            </ItemTemplate>
                            <HeaderStyle Width="10%"/>
                        </asp:TemplateField>
                        <asp:TemplateField HeaderText="发放日期">
                            <ItemTemplate>
                                <%# Eval("SalaryDate").ToString().Length > 0 ? DateTime.Parse(Eval("SalaryDate").ToString()).ToString("yyyy-MM-dd") : ""%>
                            </ItemTemplate>
                            <ItemStyle Width="10%" />
                        </asp:TemplateField>
                        <asp:TemplateField HeaderText="发放金额">
                            <ItemTemplate>
                                <%# Eval("TotalSalary").ToString()%>
                            </ItemTemplate>
                            <ItemStyle Width="10%" />
                        </asp:TemplateField>
                        <asp:TemplateField HeaderText="签收状态">
                            <ItemTemplate>
                                <%# Eval("SignStatus").ToString()=="1" ? "已签收" : "未签收"%>
                            </ItemTemplate>
                            <HeaderStyle Width="10%"/>
                        </asp:TemplateField>
                        <asp:TemplateField HeaderText="未签收天数">
                            <ItemTemplate>
                                <%# Eval("NotSingDay").ToString()%>
                            </ItemTemplate>
                            <ItemStyle Width="10%" />
                        </asp:TemplateField>
                        <asp:TemplateField HeaderText="">
                            <ItemTemplate>
                                <asp:LinkButton ID="hyView" OnClientClick='<%#"return PopSalaryInfo(this, " + Eval("ID").ToString()+");"%>' text="查看" runat="server"></asp:LinkButton>
                            </ItemTemplate>
                            <ItemStyle CssClass="center" Width="4%" />
                        </asp:TemplateField>                                             
                    </Columns>
            </asp:GridView>
              <table runat="server" class="table table-noborder" border="0">    
                <tr>
                    <td align="left">        
                        <div id="PageInfo" runat="server" class="table table-pager">  
                        </div>
                    </td>
                </tr>        
              </table>

  
          </ContentTemplate>
        </asp:UpdatePanel>
<div>	
</div>
<script language="javascript" src="/SiteFiles/bairong/scripts/datepicker/wdatepicker.js"></script>
    </form>
</body>
</html>
