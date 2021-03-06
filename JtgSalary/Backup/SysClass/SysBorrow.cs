﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CyxPack.CommonOperation;
using CyxPack.OperateSqlServer;
using System.Data.SqlClient;
using System.Data;

namespace JtgTMS.SysClass
{
    public class SysBorrow
    {
        //工具借用单查询
        public static string Borrow_ConsumeOpCode = "", Borrow_ConsumeOpName = "", Borrow_ConsumeUserID = "";
        public static string Borrow_SearchText = "";
        public static string Borrow_ApprovalStatus = "";

        //工具借用确认
        public static string BorrowApproval_SearchText = "";

        public static int Borrow_Draft = 0, Borrow_ApprovalIsOK = 1, ConsumeType_BorrowValue = 1;
        public static string GetTableRecGuidByID(int _BorrowID)
        {
            string _TableRecGuid = "";
            SqlDataReader sdr = GetSingleBorrowByReader(_BorrowID);
            if (sdr.Read())
            {
                _TableRecGuid = sdr["TableRecGuid"].ToString();
            }
            sdr.Close();
            return _TableRecGuid;
        }

        public static DataSet GetBorrowLstByDataSet(int _OrganID, string sWhereSQL)
        {
            string sSQL = "";
            sSQL = "Select a.*"
                + ", b.OpName as ConsumeOpName, c.OrganName"
                + ", (Case IsNull(ApprovalStatus,0) when 0 then '草稿' when 1 then '正式' end) As ApprovalStatusName"
                + " from Consume_Info a "
                + " left join SysUser_Info b on b.Status=0 And a.ConsumeUserID=b.ID"
                + " left join SysOrgan_Info c on c.Status=0 And a.OrganID=c.ID"
                + " Where a.Status=0 And ConsumeType=" + ConsumeType_BorrowValue.ToString() + sWhereSQL;
            if (_OrganID > 0)
            {
                sSQL = sSQL + " And a.OrganID=" + _OrganID.ToString();
            }
            sSQL = sSQL + " Order By a.ConsumeDate Desc";

            return DataCommon.GetDataByDataSet(sSQL);
        }

        public static SqlDataReader GetBorrowLstByReader(int _OrganID, string sWhereSQL)
        {
            string sSQL = "";
            sSQL = "Select a.*"
                + ", b.OpName as ConsumeOpName, c.OrganName"
                + ", (Case IsNull(ApprovalStatus,0) when 0 then '草稿' when 1 then '正式' end) As ApprovalStatusName"
                + " from Consume_Info a "
                + " left join SysUser_Info b on b.Status=0 And a.ConsumeUserID=b.ID"
                + " left join SysOrgan_Info c on c.Status=0 And a.OrganID=c.ID"
                + " Where a.Status=0 And ConsumeType=" + ConsumeType_BorrowValue.ToString() + sWhereSQL;
            if (_OrganID > 0)
            {
                sSQL = sSQL + " And a.OrganID=" + _OrganID.ToString();
            }
            sSQL = sSQL + " Order By a.ConsumeDate Desc";

            return DataCommon.GetDataByReader(sSQL);
        }

        public static DataSet GetBorrowDetailsLstByDataSet(int ConsumeID, string WhereSQL)
        {
            string sSQL = "Select a.*, b.ToolNo, b.ToolName, b.AliasesName,"
                + " b.Specification, b.MaterialCode,b.Unit, IsNull(c.Quantity,0) As StockQuantity, a.Quantity As OldQuantity "
                + ", c.StorageLocation, d.ToolCode, d.TestCode"
                + " from ConsumeDetails_Info a "
                + " left join Tool_Info b on b.Status=0 And b.ToolType=" + SysClass.SysTool._NomalToolType.ToString() + " and a.ToolID=b.ID"
                + " left Join ToolStock_Info c on c.Status=0 And c.OrganID=" + SysGlobal.GetCurrentUserOrganID().ToString() + " and c.ToolID=a.ToolID"
                + " left join ToolStockDetail_Info d on d.Status=0 And a.ToolDetailID=d.ID"
                + " Where IsNull(a.ConsumeID,0)=" + ConsumeID.ToString()
                + " And a.Status=0" + WhereSQL;

            sSQL = sSQL + " Order By b.ToolNo";

            return DataCommon.GetDataByDataSet(sSQL);
        }

        public static SqlDataReader GetBorrowDetailsLstByReader(int ConsumeID, string WhereSQL)
        {
            string sSQL = "Select a.*, b.ToolNo, b.ToolName, b.AliasesName, b.Specification, b.MaterialCode,b.Unit  from ConsumeDetails_Info a "
                + " left join Tool_Info b on b.Status=0 And b.ToolType=" + SysClass.SysTool._NomalToolType.ToString() + " and a.ToolID=b.ID"
                + " Where a.Status=0" + WhereSQL;

            if (ConsumeID > 0)
            {
                sSQL += " And IsNull(a.ConsumeID,0)=" + ConsumeID.ToString() ;
            }

            sSQL = sSQL + " Order By b.ToolNo";

            return DataCommon.GetDataByReader(sSQL);
        }

        public static SqlDataReader GetBorrowDetailsLstByReader(string WhereSQL)
        {
            string sSQL = "Select a.*, b.ToolNo, b.ToolName, b.AliasesName, b.Specification, b.MaterialCode,b.Unit from ConsumeDetails_Info a "
                + " left join Tool_Info b on b.Status=0 And b.ToolType=" + SysClass.SysTool._NomalToolType.ToString() + " and a.ToolID=b.ID"
                + " Where a.Status=0" + WhereSQL;

            sSQL = sSQL + " Order By b.ToolNo";

            return DataCommon.GetDataByReader(sSQL);
        }

        public static Boolean CheckBorrowNoExists(int ConsumeID, string ConsumeNo)
        {
            string sSqlText = "Select 1 From Consume_Info Where ConsumeType=" + ConsumeType_BorrowValue.ToString() 
                +" And ConsumeNo='" + ConsumeNo + "' And ID<>" + ConsumeID.ToString();

            return SysGlobal.GetExecSqlIsExist(sSqlText);
        }

        //更新添加工具档案信息
        public static int UpdateSingleBorrow(int _BorrowID, string[] FieldValues, string DetailsSQL)
        {
            string sSqlText = "begin";

            //sSqlText += " update ToolStock_Info Set ToolStock_Info.Quantity=ToolStock_Info.Quantity+b.Quantity "
            //    + ", ToolStock_Info.BorrowQuantity=ToolStock_Info.BorrowQuantity - b.Quantity"
            //    + " From ConsumeDetails_Info b where b.consumeID In (Select ID From Consume_Info Where Status=0 "
            //    + " And IsNull(ApprovalStatus,0)=1 And TableRecGuid='" + FieldValues.GetValue(0) + "') and ToolStock_Info.ToolID=b.ToolID;";

            sSqlText += " Update ToolStock_Info Set ToolStock_Info.Quantity=ToolStock_Info.Quantity + b.Quantity "
               + ", ToolStock_Info.BorrowQuantity=ToolStock_Info.BorrowQuantity - b.Quantity"
               + " From (Select ToolID, Sum(Quantity) As Quantity From ConsumeDetails_Info a, Consume_Info b where a.consumeID=b.Id  "
               + " And b.TableRecGuid='" + FieldValues.GetValue(0) + "' and b.ApprovalStatus=1 And b.Status=0 Group By ToolID) b "
               + " Where ToolStock_Info.ToolID=b.ToolID And ToolStock_Info.OrganID=" + SysGlobal.GetCurrentUserOrganID().ToString() + ";";

            if (_BorrowID > 0)
            {
                sSqlText = sSqlText + " UPDATE Consume_Info SET ConsumeNo='" + FieldValues.GetValue(1) + "'"
                     + ",ConsumeUserID=" + FieldValues.GetValue(2) + ""
                     + ",Description='" + FieldValues.GetValue(3) + "'"
                     + ",ApprovalStatus='" + FieldValues.GetValue(4) + "'";
                sSqlText = sSqlText + " WHERE ID=" + _BorrowID + "" + ";";

                sSqlText += " ;";
            }
            else
            {
                sSqlText = sSqlText + " Insert Into Consume_Info (TableRecGuid"
                    + ", ConsumeNo"
                    + ", ConsumeType"
                    + ", ConsumeDate"
                    + ", OrganID"
                    + ", ConsumeUserID"
                    + ", CreateUserID"
                    + ", Description"
                    + ", ApprovalStatus)"
                    + " Values('" + FieldValues.GetValue(0) + "'"
                    + ",'" + FieldValues.GetValue(1) + "'"
                    + "," + ConsumeType_BorrowValue.ToString()
                    + ",GetDate()"
                    + "," + SysGlobal.GetCurrentUserOrganID().ToString()
                    + "," + FieldValues.GetValue(2) + ""
                    + "," + SysGlobal.GetCurrentUserID().ToString() + ""
                    + ",'" + FieldValues.GetValue(3) + "'"
                    + "," + FieldValues.GetValue(4) + ")";
                sSqlText = sSqlText + " ;";
            }
            sSqlText = sSqlText + DetailsSQL;


            sSqlText += " Insert Into ToolStock_Info (OrganID, ToolID, Quantity)"
               + " (Select distinct " + SysClass.SysGlobal.GetCurrentUserOrganID().ToString() + ", ToolID, 0 From ConsumeDetails_Info Where Status=0 "
               + " And ConsumeID In (Select ID From Consume_Info Where Status=0 And IsNull(ApprovalStatus,0)=1 And TableRecGuid='" + FieldValues.GetValue(0) + "')"
               + " And ToolID not in (Select ToolID From ToolStock_Info Where OrganID=" + SysClass.SysGlobal.GetCurrentUserOrganID().ToString() + "));";

            sSqlText += " Update ToolStock_Info Set ToolStock_Info.Quantity=ToolStock_Info.Quantity - b.Quantity "
               + ", ToolStock_Info.BorrowQuantity=ToolStock_Info.BorrowQuantity + b.Quantity"
               + " From (Select ToolID, Sum(Quantity) As Quantity From ConsumeDetails_Info a, Consume_Info b where a.consumeID=b.Id  "
               + " And b.TableRecGuid='" + FieldValues.GetValue(0) + "'and b.ApprovalStatus=1 And b.Status=0 Group By ToolID) b "
               + " Where ToolStock_Info.ToolID=b.ToolID And ToolStock_Info.OrganID=" + SysGlobal.GetCurrentUserOrganID().ToString() + ";";

            sSqlText += " Update ToolStockDetail_Info Set ToolStockDetail_Info.ToolStatus=2 From "
                + " ConsumeDetails_Info b where b.consumeID In (Select ID From Consume_Info Where Status=0 And IsNull(ApprovalStatus,0)=1 And TableRecGuid='" + FieldValues.GetValue(0) + "') and ToolStockDetail_Info.ID=b.ToolDetailID"
                + " And ToolStockDetail_Info.OrganID=" + SysClass.SysGlobal.GetCurrentUserOrganID() + ";";

            //sSqlText += " update ToolStock_Info Set ToolStock_Info.Quantity=ToolStock_Info.Quantity-b.Quantity "
            //    + ", ToolStock_Info.BorrowQuantity=ToolStock_Info.BorrowQuantity + b.Quantity"
            //    + " From ConsumeDetails_Info b where b.consumeID In (Select ID From Consume_Info Where Status=0 And IsNull(ApprovalStatus,0)=1 "
            //    + " And TableRecGuid='" + FieldValues.GetValue(0) + "') and ToolStock_Info.ToolID=b.ToolID"
            //    + " And ToolStock_Info.OrganID=" + SysClass.SysGlobal.GetCurrentUserOrganID() + ";";

               sSqlText += " end;";
            return DataCommon.QueryData(sSqlText);
        }

        public static SqlDataReader GetSingleBorrowByReader(int _BorrowID)
        {
            string sSQL = "Select a.*"
                + ", b.OpCode as ConsumeOpCode,  b.OpName as ConsumeOpName, c.OrganName, d.OpName as CreateOpName"
                + ", (Case IsNull(ApprovalStatus,0) when 0 then '草稿' when 1 then '正式' end) As ApprovalStatusName"
                + " from Consume_Info a "
                + " left join SysUser_Info b on b.Status=0 And a.ConsumeUserID=b.ID"
                + " left join SysOrgan_Info c on c.Status=0 And a.OrganID=c.ID"
                + " left join SysUser_Info d on d.Status=0 And a.CreateUserID=d.ID"
                + " Where a.Status=0 And a.ID=" + _BorrowID.ToString();

            return DataCommon.GetDataByReader(sSQL);
        }

        //删除工具申请单
        public static int DeleteSingleBorrow(string _BorrowIDs)
        {
            string sSQL = "begin ";

            sSQL += " update ToolStock_Info Set ToolStock_Info.Quantity=ToolStock_Info.Quantity-b.Quantity "
                + ", ToolStock_Info.BorrowQuantity=ToolStock_Info.BorrowQuantity + b.Quantity"
	                + " From "
                + " (select a.ToolID, Sum(a.Quantity) As Quantity From ConsumeDetails_Info a, Consume_Info b "
                + " where a.ConsumeID=b.ID And IsNull(b.ApprovalStatus,0)=1 And b.ID in (" + _BorrowIDs.ToString() + ")"
                + " group by a.ToolID) b where  ToolStock_Info.ToolID=b.ToolID";

            sSQL += " Delete from Consume_Info Where ID in (" + _BorrowIDs.ToString() + "); ";
            sSQL = sSQL + " Delete from ConsumeDetails_Info Where ConsumeID in (" + _BorrowIDs.ToString() + "); ";
            sSQL = sSQL + " End;";
            return DataCommon.QueryData(sSQL);
        }

        public static int UpdateApprovalBorrow(string MainTableName, string IDs, int ApprovalStatus, string Description)
        {
            string sSqlText = "begin";

            sSqlText += " Insert Into ApprovalLog_Info (MainTableName, MainID, ApprovalStatus, ApprovalUserID, ApprovalTime, Description) "
                + " (Select '" + MainTableName + "', ID, " + ApprovalStatus.ToString() + "," + SysGlobal.GetCurrentUserID().ToString()
                + ", GetDate(), '" + Description + "' From Consume_info Where Status=0 And ID In (" + IDs + ")); ";

            sSqlText += " Update Consume_info Set ApprovalStatus=" + ApprovalStatus.ToString()
                + " Where Status=0  And ID In (" + IDs + ");";

            if (ApprovalStatus == Borrow_ApprovalIsOK)
            {
                sSqlText += " Insert Into ToolStock_Info (OrganID, ToolID, Quantity)"
                + " (Select distinct " + SysClass.SysGlobal.GetCurrentUserOrganID().ToString() + ", ToolID, 0 From ConsumeDetails_Info Where Status=0 "
                + " And ConsumeID In (" + IDs.ToString() + ")"
                + " And ToolID not in (Select ToolID From ToolStock_Info Where OrganID=" + SysClass.SysGlobal.GetCurrentUserOrganID().ToString() + "));";

                sSqlText += " Update ToolStock_Info Set ToolStock_Info.Quantity=ToolStock_Info.Quantity - b.Quantity "
                   + ", ToolStock_Info.ConsumeQuantity=ToolStock_Info.ConsumeQuantity + b.Quantity"
                   + " From (Select ToolID, Sum(Quantity) As Quantity From ConsumeDetails_Info where "
                   + " ConsumeID in (" + IDs.ToString() + ") Group By ToolID) b "
                   + " Where ToolStock_Info.ToolID=b.ToolID And ToolStock_Info.OrganID=" + SysGlobal.GetCurrentUserOrganID().ToString() + ";";

                sSqlText += " Update ToolStockDetail_Info Set ToolStockDetail_Info.ToolStatus=1 From "
                    + " ConsumeDetails_Info b where b.consumeID In (" + IDs.ToString() + ") and ToolStockDetail_Info.ID=b.ToolDetailID"
                    + " And ToolStockDetail_Info.OrganID=" + SysClass.SysGlobal.GetCurrentUserOrganID() + ";";


                //sSqlText += " update ToolStock_Info Set ToolStock_Info.Quantity=ToolStock_Info.Quantity-b.Quantity "
                //    + ", ToolStock_Info.BorrowQuantity=ToolStock_Info.BorrowQuantity + b.Quantity"
                //    + " From "
                //    + " (select a.ToolID, Sum(a.Quantity) As Quantity From ConsumeDetails_Info a, Consume_Info b "
                //    + " where a.ConsumeID=b.ID And IsNull(b.ApprovalStatus,0)=1 And b.ID in (" + IDs.ToString() + ")"
                //    + " group by a.ToolID) b where  ToolStock_Info.ToolID=b.ToolID";
            }

            sSqlText += " end;";
            return DataCommon.QueryData(sSqlText);
        }
    }
}
