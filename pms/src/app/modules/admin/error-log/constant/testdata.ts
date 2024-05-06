import { DEFAULT_PAGINATION } from "@constants/constant";
import { IErrorLogDelete, IErrorLogList, } from "../models/error.log";

export const testResponse: IErrorLogList = {
  records: [
    {
        id: 1,
        memberId: 10,
        memberName: "",
        ipAddress: "43.250.158.81",
        clientBrowser: "Chrome 121.0",
        errorMessage: "A public action method 'flow-type-icons' was not found on controller 'PMSApp.Controllers.DocumentController'.",
        errorStackTrace: "at System.Web.Mvc.Controller.HandleUnknownAction(String actionName) at System.Web.Mvc.Controller.<BeginExecuteCore>b__1d(IAsyncResult asyncResult, ExecuteCoreState innerState) at System.Web.Mvc.Async.AsyncResultWrapper.WrappedAsyncVoid`1.CallEndDelegate(IAsyncResult asyncResult) at System.Web.Mvc.Async.AsyncResultWrapper.WrappedAsyncResultBase`1.End() at System.Web.Mvc.Controller.EndExecuteCore(IAsyncResult asyncResult) at System.Web.Mvc.Controller.<BeginExecute>b__15(IAsyncResult asyncResult, Controller controller) at System.Web.Mvc.Async.AsyncResultWrapper.WrappedAsyncVoid`1.CallEndDelegate(IAsyncResult asyncResult) at System.Web.Mvc.Async.AsyncResultWrapper.WrappedAsyncResultBase`1.End() at System.Web.Mvc.Controller.EndExecute(IAsyncResult asyncResult) at System.Web.Mvc.Controller.System.Web.Mvc.Async.IAsyncController.EndExecute(IAsyncResult asyncResult) at System.Web.Mvc.MvcHandler.<BeginProcessRequest>b__5(IAsyncResult asyncResult, ProcessRequestState innerState) at System.Web.Mvc.Async.AsyncResultWrapper.WrappedAsyncVoid`1.CallEndDelegate(IAsyncResult asyncResult) at System.Web.Mvc.Async.AsyncResultWrapper.WrappedAsyncResultBase`1.End() at System.Web.Mvc.MvcHandler.EndProcessRequest(IAsyncResult asyncResult) at System.Web.Mvc.MvcHandler.System.Web.IHttpAsyncHandler.EndProcessRequest(IAsyncResult result) at System.Web.HttpApplication.CallHandlerExecutionStep.System.Web.HttpApplication.IExecutionStep.Execute() at System.Web.HttpApplication.ExecuteStepImpl(IExecutionStep step) at System.Web.HttpApplication.ExecuteStep(IExecutionStep step, Boolean& completedSynchronously)",
        createdOn: "2024-02-09T12:22:13.69421"
    },
  ],
  totalRecords: 20,
};
export const testErrorLogData = {
  memberId: 10,
  memberName: "",
  ipAddress: "43.250.158.81",
  clientBrowser: "Chrome 121.0",
  errorMessage: "A public action method 'flow-type-icons' was not found on controller 'PMSApp.Controllers.DocumentController'.",
  errorStackTrace: "at System.Web.Mvc.Controller.HandleUnknownAction(String actionName) at System.Web.Mvc.Controller.<BeginExecuteCore>b__1d(IAsyncResult asyncResult, ExecuteCoreState innerState) at System.Web.Mvc.Async.AsyncResultWrapper.WrappedAsyncVoid`1.CallEndDelegate(IAsyncResult asyncResult) at System.Web.Mvc.Async.AsyncResultWrapper.WrappedAsyncResultBase`1.End() at System.Web.Mvc.Controller.EndExecuteCore(IAsyncResult asyncResult) at System.Web.Mvc.Controller.<BeginExecute>b__15(IAsyncResult asyncResult, Controller controller) at System.Web.Mvc.Async.AsyncResultWrapper.WrappedAsyncVoid`1.CallEndDelegate(IAsyncResult asyncResult) at System.Web.Mvc.Async.AsyncResultWrapper.WrappedAsyncResultBase`1.End() at System.Web.Mvc.Controller.EndExecute(IAsyncResult asyncResult) at System.Web.Mvc.Controller.System.Web.Mvc.Async.IAsyncController.EndExecute(IAsyncResult asyncResult) at System.Web.Mvc.MvcHandler.<BeginProcessRequest>b__5(IAsyncResult asyncResult, ProcessRequestState innerState) at System.Web.Mvc.Async.AsyncResultWrapper.WrappedAsyncVoid`1.CallEndDelegate(IAsyncResult asyncResult) at System.Web.Mvc.Async.AsyncResultWrapper.WrappedAsyncResultBase`1.End() at System.Web.Mvc.MvcHandler.EndProcessRequest(IAsyncResult asyncResult) at System.Web.Mvc.MvcHandler.System.Web.IHttpAsyncHandler.EndProcessRequest(IAsyncResult result) at System.Web.HttpApplication.CallHandlerExecutionStep.System.Web.HttpApplication.IExecutionStep.Execute() at System.Web.HttpApplication.ExecuteStepImpl(IExecutionStep step) at System.Web.HttpApplication.ExecuteStep(IExecutionStep step, Boolean& completedSynchronously)",
  createdOn: "2024-02-09T12:22:13.69421"
};
export const testRowData = {
  currentRowIndex: 0,
  currentPageSize: 3,
  currentPageNumber: 1,
  rowData: {
    id: 1,
    memberId: 10,
    memberName: "",
    ipAddress: "43.250.158.81",
    clientBrowser: "Chrome 121.0",
    errorMessage: "A public action method 'flow-type-icons' was not found on controller 'PMSApp.Controllers.DocumentController'.",
    errorStackTrace: "at System.Web.Mvc.Controller.HandleUnknownAction(String actionName) at System.Web.Mvc.Controller.<BeginExecuteCore>b__1d(IAsyncResult asyncResult, ExecuteCoreState innerState) at System.Web.Mvc.Async.AsyncResultWrapper.WrappedAsyncVoid`1.CallEndDelegate(IAsyncResult asyncResult) at System.Web.Mvc.Async.AsyncResultWrapper.WrappedAsyncResultBase`1.End() at System.Web.Mvc.Controller.EndExecuteCore(IAsyncResult asyncResult) at System.Web.Mvc.Controller.<BeginExecute>b__15(IAsyncResult asyncResult, Controller controller) at System.Web.Mvc.Async.AsyncResultWrapper.WrappedAsyncVoid`1.CallEndDelegate(IAsyncResult asyncResult) at System.Web.Mvc.Async.AsyncResultWrapper.WrappedAsyncResultBase`1.End() at System.Web.Mvc.Controller.EndExecute(IAsyncResult asyncResult) at System.Web.Mvc.Controller.System.Web.Mvc.Async.IAsyncController.EndExecute(IAsyncResult asyncResult) at System.Web.Mvc.MvcHandler.<BeginProcessRequest>b__5(IAsyncResult asyncResult, ProcessRequestState innerState) at System.Web.Mvc.Async.AsyncResultWrapper.WrappedAsyncVoid`1.CallEndDelegate(IAsyncResult asyncResult) at System.Web.Mvc.Async.AsyncResultWrapper.WrappedAsyncResultBase`1.End() at System.Web.Mvc.MvcHandler.EndProcessRequest(IAsyncResult asyncResult) at System.Web.Mvc.MvcHandler.System.Web.IHttpAsyncHandler.EndProcessRequest(IAsyncResult result) at System.Web.HttpApplication.CallHandlerExecutionStep.System.Web.HttpApplication.IExecutionStep.Execute() at System.Web.HttpApplication.ExecuteStepImpl(IExecutionStep step) at System.Web.HttpApplication.ExecuteStep(IExecutionStep step, Boolean& completedSynchronously)",
    createdOn: "2024-02-09T12:22:13.69421"
  },
};
export const testSearchParam = {
  ...DEFAULT_PAGINATION,
  startDate: null,
  endData: null,
  isActive: true,
  sortBy: 'memberName',
  pageSize: 10
};

export const testSortParam = {
  sortColumn: 'memberName',
  startDate: null,
  endData: null,
  isActive: true,
  sortBy: 'memberName',
  sortDirection: 'asc'
};
export const errorlogdetails = {
        id: 1,
        memberId: 10,
        memberName: "",
        ipAddress: "43.250.158.81",
        clientBrowser: "Chrome 121.0",
        errorMessage: "A public action method 'flow-type-icons' was not found on controller 'PMSApp.Controllers.DocumentController'.",
        errorStackTrace: "at System.Web.Mvc.Controller.HandleUnknownAction(String actionName) at System.Web.Mvc.Controller.<BeginExecuteCore>b__1d(IAsyncResult asyncResult, ExecuteCoreState innerState) at System.Web.Mvc.Async.AsyncResultWrapper.WrappedAsyncVoid`1.CallEndDelegate(IAsyncResult asyncResult) at System.Web.Mvc.Async.AsyncResultWrapper.WrappedAsyncResultBase`1.End() at System.Web.Mvc.Controller.EndExecuteCore(IAsyncResult asyncResult) at System.Web.Mvc.Controller.<BeginExecute>b__15(IAsyncResult asyncResult, Controller controller) at System.Web.Mvc.Async.AsyncResultWrapper.WrappedAsyncVoid`1.CallEndDelegate(IAsyncResult asyncResult) at System.Web.Mvc.Async.AsyncResultWrapper.WrappedAsyncResultBase`1.End() at System.Web.Mvc.Controller.EndExecute(IAsyncResult asyncResult) at System.Web.Mvc.Controller.System.Web.Mvc.Async.IAsyncController.EndExecute(IAsyncResult asyncResult) at System.Web.Mvc.MvcHandler.<BeginProcessRequest>b__5(IAsyncResult asyncResult, ProcessRequestState innerState) at System.Web.Mvc.Async.AsyncResultWrapper.WrappedAsyncVoid`1.CallEndDelegate(IAsyncResult asyncResult) at System.Web.Mvc.Async.AsyncResultWrapper.WrappedAsyncResultBase`1.End() at System.Web.Mvc.MvcHandler.EndProcessRequest(IAsyncResult asyncResult) at System.Web.Mvc.MvcHandler.System.Web.IHttpAsyncHandler.EndProcessRequest(IAsyncResult result) at System.Web.HttpApplication.CallHandlerExecutionStep.System.Web.HttpApplication.IExecutionStep.Execute() at System.Web.HttpApplication.ExecuteStepImpl(IExecutionStep step) at System.Web.HttpApplication.ExecuteStep(IExecutionStep step, Boolean& completedSynchronously)",
        createdOn: "2024-02-09T12:22:13.69421"
};
export const deleteErrorLog:IErrorLogDelete = {
  ids: ''
};
