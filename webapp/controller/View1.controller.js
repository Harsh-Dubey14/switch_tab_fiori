sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
  "use strict";

  return Controller.extend("tabtable1.controller.View1", {

    onInit: function () {
      const oViewModel = new JSONModel({
        pageState: "tiles",
        selectedTable: "",
        currentPage: 1,
        pageSize: 10,
        totalPages: 1
      });
      this.getView().setModel(oViewModel, "view1");

      const oPaginationModel = new JSONModel({
        ledgerPageData: [],
        vendorPageData: []
      });
      this.getView().setModel(oPaginationModel, "pagination");
    },

    onShowLedger: function () {
      const oViewModel = this.getView().getModel("view1");
      oViewModel.setProperty("/selectedTable", "ZLEDGERSet");
      oViewModel.setProperty("/pageState", "table");
      oViewModel.setProperty("/currentPage", 1);
      this._fetchData("ZLEDGERSet");
    },

    onShowVendorDetails: function () {
      const oViewModel = this.getView().getModel("view1");
      oViewModel.setProperty("/selectedTable", "ZVEND_DETAILSSet");
      oViewModel.setProperty("/pageState", "table");
      oViewModel.setProperty("/currentPage", 1);
      this._fetchData("ZVEND_DETAILSSet");
    },

    onNavBack: function () {
      const oViewModel = this.getView().getModel("view1");
      oViewModel.setProperty("/pageState", "tiles");
      oViewModel.setProperty("/selectedTable", "");
    },

    _fetchData: function (sTable) {
      const oMainModel = this.getView().getModel("mainService");

      oMainModel.read("/" + sTable, {
        success: (oData) => {
          if (sTable === "ZLEDGERSet") {
            this._fullLedgerData = oData.results;
          } else {
            this._fullVendorData = oData.results;
          }
          this._updatePageData();
        },
        error: () => {
          MessageToast.show("Failed to fetch data for " + sTable);
        }
      });
    },

    _updatePageData: function () {
      const oViewModel = this.getView().getModel("view1");
      const oPaginationModel = this.getView().getModel("pagination");

      const pageSize = oViewModel.getProperty("/pageSize");
      const currentPage = oViewModel.getProperty("/currentPage");
      const selectedTable = oViewModel.getProperty("/selectedTable");

      const fullData = selectedTable === "ZLEDGERSet"
        ? this._fullLedgerData
        : this._fullVendorData;

      const totalPages = Math.ceil(fullData.length / pageSize);
      oViewModel.setProperty("/totalPages", totalPages);

      const startIndex = (currentPage - 1) * pageSize;
      const pageData = fullData.slice(startIndex, startIndex + pageSize);

      if (selectedTable === "ZLEDGERSet") {
        oPaginationModel.setProperty("/ledgerPageData", pageData);
      } else {
        oPaginationModel.setProperty("/vendorPageData", pageData);
      }
    },

    onNextPage: function () {
      const oViewModel = this.getView().getModel("view1");
      const currentPage = oViewModel.getProperty("/currentPage");
      const totalPages = oViewModel.getProperty("/totalPages");

      if (currentPage < totalPages) {
        oViewModel.setProperty("/currentPage", currentPage + 1);
        this._updatePageData();
      }
    },

    onPrevPage: function () {
      const oViewModel = this.getView().getModel("view1");
      const currentPage = oViewModel.getProperty("/currentPage");

      if (currentPage > 1) {
        oViewModel.setProperty("/currentPage", currentPage - 1);
        this._updatePageData();
      }
    },

    onFirstPage: function () {
      const oViewModel = this.getView().getModel("view1");
      oViewModel.setProperty("/currentPage", 1);
      this._updatePageData();
    },

    onLastPage: function () {
      const oViewModel = this.getView().getModel("view1");
      const totalPages = oViewModel.getProperty("/totalPages");
      oViewModel.setProperty("/currentPage", totalPages);
      this._updatePageData();
    }

  });
});
