class DocumentSearchMainModel {
    constructor(data) {
      this.pageHeading = data.pageHeading;
      this.pageTitle = data.pageTitle;
      this.ptdSearchText = data.ptdSearchText;
      this.errorLabel = data.errorLabel;
      this.searchOptions = data.searchOptions;
      this.searchText = data.searchText;
    }
  }
  
  export { DocumentSearchMainModel };