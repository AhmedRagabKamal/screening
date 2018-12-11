<template>
  <div class="tab-pane fade show"
   id="screening" role="tabpanel" aria-labelledby="screening-tab">
    <form enctype="multipart/form-data">
      <div class="card shadow" v-for="(screening, index) in screeningData" :key="index">
        <div class="card-header">
          <div class="row">
            <div class="col">
              <h4 class="text-bold">Add Screening Data</h4>
            </div>
            <div class="col">
              <a class="btn btn-link float-right" data-toggle="collapse"
                :href="'#screening' + index" role="button"
                aria-expanded="false" :aria-controls="'screening' + index">
                <i class="fas fa-chevron-down"></i>
              </a>
            </div>
          </div>
        </div>
        <div class="card-body collapse show" :id="'screening' + index">
          <div class="row">
            <div class="col form-group" :class="{invalid: errors.has('Insurance Unique Number' + index)}">
              <label>Insurance Unique Number
                <span class="text-danger">*</span>
              </label>
              <v-select :options="insurancesUnquieIds" v-validate="{ required:true }" label="name"
               value="id" :name="'Insurance Unique Number' + index"
               :id="'screening.insurance_unique_id' + index" :selected="index == 0"
                @input="checkDateValidty(index);checkHasMobileAndNetwork(screening.insurance_unique_id, index)"
                v-model="screening.insurance_unique_id" placeholder="Please select Insurance Profile"></v-select>
              <span class="text-danger" v-if="errors.has('Insurance Unique Number' + index)">
                {{ errors.first('Insurance Unique Number' + index).replace(index,'') }}</span>
            </div>
            <div class="form-group col" :class="{invalid: errors.has('Screening Type' + index)}">
              <label> Screening Type
                <span class="text-danger">*</span>
              </label>
              <v-select :options="screeningTypes" label="name" value="id" v-validate="'required'"
               :name="'Screening Type' + index"
                v-model="screening.disease" placeholder="Select Screening Type"></v-select>
              <span class="text-danger" v-if="errors.has('Screening Type' + index)">
                {{ errors.first('Screening Type' + index).replace(index,'') }}</span>
            </div>
            <div class="w-100"></div>
            <div class="form-group col" :class="{invalid: errors.has('Screening Test Category' + index)}">
              <label> Screening Test Category
                <span class="text-danger">*</span>
              </label>
              <v-select :options="screeningCategories" v-validate="{ required:true }"
               label="name" value="id" :name="'Screening Test Category' + index"
               :disabled="user.type === 1" @input="getScreenTestOutCome(screening.outcome_category);
               checkCategoryValue(screening.outcome_category, screening.test_outcome, index);
               getScreenDocumentType(screening.outcome_category);"
                v-model="screening.outcome_category" placeholder="Please selectScreening Test Category"></v-select>
              <span class="text-danger" v-if="errors.has('Screening Test Category' + index)">
                {{ errors.first('Screening Test Category' + index).replace(index, '') }}</span>
            </div>
            <div class="form-group col" :class="{'invalid': errors.has('Screening Test Date' + index)
								|| (testDateValid && sectionIndex == index)}">
              <label>Screening Test Date
                <span class="text-danger">*</span>
              </label>
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">
                    <i class="fas fa-calendar-alt"></i>
                  </span>
                </div>
                <date-picker v-model="screening.test_date" :config="options" autocomplete="off"
                 :id="'Screening Test Date' + index"
                  ref="Screening Test Date" :disabled="user.type === 1" :name="'Screening Test Date' + index"
                  placeholder="DD/MM/YYYY" @dp-change="checkDateValidty(index)"
                  v-validate="{required:true}"></date-picker>
                <span class="form-text text-danger  bottom-20" v-if="errors.has('Screening Test Date' + index)">
                  {{ errors.first('Screening Test Date' + index).replace(index, '') }}
                </span>
                <span class="form-text text-danger bottom-20"
                 v-if="testDateValid && sectionIndex == index && !errors.has('Screening Test Date' + index)">
                  Screening Test Date is a future date,
                   before policy start date or after end or termination date</span>
              </div>
            </div>
            <div class="w-100"></div>
            <div class="form-group col" :class="{invalid: errors.has('Screening Test Code' + index)}">
              <label> Screening Test Code
                <span class="text-danger">*</span>
              </label>
              <v-select :options="testCodes" label="title" value="title"
               :filterable="false" v-model="screening.test_code"
                :name="'Screening Test Code' + index" :disabled="user.type === 1"
                 @search="onSearch" @change="checkScreeningFormValidaity()"
                placeholder="Please enter test code" v-validate="{required:true}">
                <template slot="no-options">
                  Type to search ...
                </template>
              </v-select>
              <span class="text-danger" v-if="errors.has('Screening Test Code' + index)">
                {{ errors.first('Screening Test Code' + index).replace(index, '') }}</span>
            </div>
            <div class="form-group col" :class="{invalid: errors.has('Screening Test Outcome' + index)}">
              <label>Screening Test Outcome
                <span class="text-danger">*</span>
              </label>
               <v-select :options="screeningTestOutcomesArray" v-validate="{ required:true }"
               label="name" value="id" :name="'Screening Test Outcome' + index"
               :disabled="user.type === 1"
                @input="checkCategoryValue(screening.outcome_category, screening.test_outcome,index);
                makeDocumentScreening(screening, index);"
                v-model="screening.test_outcome" placeholder="Select Test Outcome"></v-select>
              <span class="text-danger" v-if="errors.has('Screening Test Outcome' + index)">
                {{ errors.first('Screening Test Outcome' + index).replace(index, '') }}</span>
            </div>
            <div class="w-100"></div>
            <div class="col form-group" :class="{invalid: errors.has('PSP Verbal Consent' + index)
             || (pspDuplicate && pspIndex == index)}">
              <label>PSP Verbal Consent
                <span class='text-danger'
                 v-show='requiredPspVerbalConsent'>*</span></label>
              <v-select :options="pspVerbalConcentTypes"
               v-validate.immediate="{ required:requiredPspVerbalConsent }" label="name" value="id"
               @input="showVerbalConsentOther(screening.verbal_consent);
               makeDocumentScreening(screening,index);
               makePSPVerbalConsentDateRequired(screening, index)"
                :disabled="user.type === 1 || disabledPspVerbalConsent"
                :name="'PSP Verbal Consent' + index" v-model="screening.verbal_consent"
                placeholder="Please select PSP Verbal Consent"></v-select>
              <span class="text-danger" v-if="errors.has('PSP Verbal Consent' + index)">
                {{ errors.first('PSP Verbal Consent' + index).replace(index, '') }}</span>
              <span class="text-danger" v-if="pspDuplicate && pspIndex == index">
                PSP Verbal Consent exists in same policy and same Screening type with different value</span>
            </div>
            <div class="form-group col" :class="{'invalid': errors.has('PSP Verbal Consent Date' + index)
							|| (pspDateValid && sectionIndex == index)}">
              <label>PSP Verbal Consent Date
                <span class="text-danger" v-if="makeVerbalConsentDateRequired">*</span>
              </label>
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">
                    <i class="fas fa-calendar-alt"></i>
                  </span>
                </div>
                <date-picker v-model="screening.verbal_consent_date"
                 :config="options" autocomplete="off"
                   :id="'PSP Verbal Consent Date' + index"
                  :disabled="disabledPspVerbalConsent || user.type === 1"
                   :name="'PSP Verbal Consent Date' + index"
                  placeholder="DD/MM/YYYY" @dp-change="checkDateValidty(index);"
                  v-validate.immediate="{required:makeVerbalConsentDateRequired}"></date-picker>
                <span class="form-text text-danger  bottom-20" v-if="errors.has('PSP Verbal Consent Date' + index)">
                  {{ errors.first('PSP Verbal Consent Date' + index).replace(index, '') }}</span>
                <span class="form-text text-danger  bottom-20" v-if="pspDateValid && sectionIndex == index && !errors.has('PSP Verbal Consent Date' + index)">
                  PSP Verbal Consent Date is a future date, before policy start date or after end or termination date
                </span>
              </div>
            </div>
            <div class="w-100"></div>
            <div class="form-group col" v-if="verbalConsentOther" :class="{invalid: errors.has('Others' + index)}">
              <label>Others<span class="text-danger">*</span></label>
              <textarea class="form-control" :name="'Others' + index" :disabled="user.type === 1" maxlength="400"
               v-model="screening.others" v-validate="{required:true}"></textarea>
                <span class="form-text text-danger" v-if="errors.has('Others' + index)">
                  {{ errors.first('Others' + index).replace(index, '') }}</span>
            </div>
            <div class="w-100"></div>
            <div class="col-sm-6">
              <div class="row">
                <div class="form-group col" v-if="showMobileNumberInput && mobileNumberIndex === index"
                 :class="{invalid: errors.has('Mobile Number' + index)}">
                  <label> Mobile Number<span class="text-danger" v-if="makeMobileNumberRequired">*</span></label>
                  <input type="text" class="form-control" :name="'Mobile Number' + index"
                    v-model="screening.mobile_number"
                    placeholder="Please enter numeric string up to 13 characters"
                     v-validate.immediate="{ required:makeMobileNumberRequired,max:13 }"
                    title="Please enter numeric string up to 13 characters" />
                  <small class="form-text text-danger" v-if="errors.has('Mobile Number' + index)">
                    {{ errors.first('Mobile Number' + index).replace(index, '') }}</small>
                </div>
                <div class="w-100"></div>
                <div class="form-group col" v-if="showInsuranceNetworkInput && insuranceNetworkIndex === index"
                 :class="{invalid: errors.has('Insurance Network' + index)}">
                  <label>Insurance Network
                    <span class="text-danger">*</span></label>
                  <input type="text" :name="'Insurance Network' + index" v-validate="{ required:true, max:50 }"
                    placeholder="Please enter Insurance Network"
                     v-model="screening.insurance_network"
                      title="Please enter Insurance Network"
                    class="form-control">
                  <small class="form-text text-danger" v-if="errors.has('Insurance Network' + index)">
                    {{ errors.first('Insurance Network' + index).replace(index, '') }}</small>
                </div>
              </div>
            </div>
            <div class="col-sm-6" :class="{'col-sm-12': !showMobileNumberInput && !showInsuranceNetworkInput && mobileNumberIndex === index}">
              <div class="row">
                <div class="form-group col">
                  <label>Remarks</label>
                  <textarea class="form-control" :disabled="user.type === 1"
                   maxlength="2000" v-model="screening.remark"
                    rows="5" name="Remarks"></textarea>
                </div>
              </div>
            </div>
            <div class="w-100">
               <label class="col"> Screening Document Type
                  <span class="text-danger" v-if="makeScreeningDocumentRequired">*</span>
                </label>
            </div>
              <div class="row w-100 relative margin-left-0 margin-right-15" v-for="(screenDoc, i) in screening.filesData" :key="i">
                <div class="col-sm-6 form-group"
                 :class="{invalid: errors.has('Screening Document Type' + i)}">
                <v-select :options="screeningDocumentTypesArray"
                 v-validate.immediate="{ required:makeScreeningDocumentRequired }" label="name" value="id"
                :name="'Screening Document Type' + i"
                  v-model="screenDoc.fileType"
                   placeholder="Please select Screening Document Type"></v-select>
                <span class="text-danger" v-if="errors.has('Screening Document Type' + i)">
                  {{ errors.first('Screening Document Type' + i).replace(i,'') }}</span>
              </div>
              <div class="col-sm-6 input-group" :class="{invalid: errors.has('Screening Document' + i)}">
                <div class="custom-file">
                  <input type="file" class="custom-file-input" :disabled="!screenDoc.fileType"
                  ref="screenFileForm" @change="handleFileUpload($event.target.files, index, i)"
                  id="screenDocument" aria-describedby="screenDocument"
                  accept=".pdf, image/*,.xls, .xlsx, .doc, .docx" :name="'Screening Document' + i"
                  v-validate.immediate="{ required:makeScreeningDocumentRequired,
                  ext:['jpg', 'jpeg', 'png', 'pdf', 'docx', 'doc', 'xls', 'xlsx'],size:10000}">
                  <label class="custom-file-label"
                  for="screenDocument">{{ screenDoc.fileName ? screenDoc.fileName : 'Choose file'}}</label>
                  <span class="text-danger" v-if="errors.has('Screening Document' + i)">
                  {{ errors.first('Screening Document' + i).replace(i,'') }}</span>
                </div>
              </div>
              <div class="absolute right-20">
                <button class="btn btn-link" v-if="i !== 0"
                 @click.prevent="removeScreeningDocument(index, i)">
                  <i class="fas fa-trash text-danger"></i>
                </button>
              </div>
            </div>
          </div>
          <hr class="dash-hr"/>
          <div class="row">
            <div class="col">
              <button class="btn btn-link float-right" @click.prevent="addNewScreeningDocument(index)">
                <i class="fas fa-plus"></i> Add New Document
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <button class="btn btn-outline-info radius"
          :disabled="isFormInvalid"
          @click.prevent="addNewScreening()">
            <i class="fas fa-plus"></i>
            Add New Screening
          </button>
        </div>
        <div class="col">
          <button class="btn btn-info btn-login float-right" :disabled="isFormInvalid"
          @click.prevent="addScreeningToMemeber(screeningData)">
            <i class="fas fa-save"></i>  Save
          </button>
        </div>
      </div>
      <!-- <div>
        {{fields}}
      </div> -->
    </form>
    <!-- <screening-list></screening-list> -->
  </div>
</template>

<script>
import Datepicker from "vuejs-datepicker";
import moment from "moment";
import { Validator } from "vee-validate";
import _ from "lodash";
// import screeningList from "./ScreeningList.vue";

export default {
  name: "AddScreening",
  props:['insurancesUnquieIds', 'screeningTypes', 'screeningCategories', 'testCodes',
  'screeningTestOutcomesArray', 'pspVerbalConcentTypes', 'pspVerbalConcentTypes', 'screeningDocumentTypesArray',
  'pspStatusData', 'memberScreeningData', 'fileTypes', 'screeningTestOutcomes', 'censusScreenings'],
  data() {
    return {
      screeningData: [
        {
          insurance_unique_id: null,
          disease: null,
          outcome_category: null,
          test_date: "",
          test_code: null,
          test_outcome: null,
          verbal_consent: null,
          verbal_consent_date: "",
          mobile_number: "",
          insurance_network: "",
          remark: "",
          others: "",
          filesData: [
            {
              fileType: null,
              file: null,
              fileName: null
            }
          ]
        }
      ],
      disabledScreenForm: false,
      fileType: false,
      fileSize: false,
      options: {
        format: "DD/MM/YYYY",
        useCurrent: false,
        showClose: true
      },
      sectionIndex: null,
      testDateValid: false,
      pspDateValid: false,
      pspDuplicate: false,
      pspIndex: null,
      diseaseDocuments: null,
      diseaseRemarks: null,
      editedPspStatus: {},
      diseaseID: null,
      testFile: null,
      documentRequired: false,
      formValidaity: false,
      verbalConsentOther: false,
      disabledPspVerbalConsent: false,
      requiredPspVerbalConsent: false,
      showInsuranceNetworkInput: false,
      showMobileNumberInput: false,
      insuranceNetworkIndex: null,
      mobileNumberIndex: null,
      makeMobileNumberRequired: false,
      makeScreeningDocumentRequired: false,
      makeVerbalConsentDateRequired: false
    };
  },
  methods: {
    makePSPVerbalConsentDateRequired(screeningData, index) {
      if (
        screeningData.verbal_consent.id == "9" ||
        screeningData.verbal_consent.id == "10"
      ) {
        this.makeVerbalConsentDateRequired = false;
      } else {
        this.makeVerbalConsentDateRequired = true;
      }
      console.log(this.makeVerbalConsentDateRequired);
    },
    makeDocumentScreening(screeningData, index) {
      if (
        screeningData.test_outcome &&
        screeningData.test_outcome.id == 3 &&
        screeningData.verbal_consent &&
        screeningData.verbal_consent.id == 2
      ) {
        this.makeScreeningDocumentRequired = true;
      } else {
        this.makeScreeningDocumentRequired = false;
      }
    },
    checkHasMobileAndNetwork(insuranceNumber, index) {
      if (insuranceNumber.insurance_network) {
        this.showInsuranceNetworkInput = false;
        this.insuranceNetworkIndex = index;
      } else {
        this.showInsuranceNetworkInput = true;
        this.insuranceNetworkIndex = index;
      }
      if (insuranceNumber.mobile_number) {
        this.showMobileNumberInput = false;
        this.mobileNumberIndex = index;
      } else {
        this.showMobileNumberInput = true;
        this.mobileNumberIndex = index;
      }
    },
    checkCategoryValue(testCategory, testOutCome, index) {
      if (testCategory && testOutCome) {
        if (testCategory.id == 2 && testOutCome.id == 2) {
          this.screeningData[index].test_outcome = null;
        }
        if (testCategory.id == 2 && testOutCome.id == 3) {
          this.requiredPspVerbalConsent = true;
        } else {
          this.requiredPspVerbalConsent = false;
        }
        if (testOutCome.id == 1) {
          this.disabledPspVerbalConsent = true;
          this.screeningData[index].verbal_consent = null;
          this.screeningData[index].verbal_consent_date = "";
        } else {
          this.disabledPspVerbalConsent = false;
        }
      }
    },
    getScreenTestOutCome(category) {
      if (category && category.id == 1) {
        this.screeningTestOutcomesArray = [
          { id: 1, name: "Negative" },
          { id: 2, name: "Requires further investigation" },
          { id: 3, name: "Positive" }
        ];
      } else if (category && category.id == 2) {
        this.screeningTestOutcomesArray = [
          { id: 1, name: "Negative" },
          { id: 3, name: "Positive" }
        ];
      } else {
        this.screeningTestOutcomesArray = [];
      }
    },
    getScreenDocumentType(category) {
      if (category && category.id == 1) {
        this.screeningDocumentTypesArray = [
          { id: 1, name: "PSP Consent" },
          { id: 2, name: "Treatment Plan" },
          { id: 3, name: "Initial Screening Results" },
          { id: 5, name: "Others" }
        ];
      } else if (category && category.id == 2) {
        this.screeningDocumentTypesArray = [
          { id: 1, name: "PSP Consent" },
          { id: 2, name: "Treatment Plan" },
          { id: 4, name: "Confirmatory Screening Results" },
          { id: 4, name: "Others" }
        ];
      } else {
        this.screeningDocumentTypesArray = [];
      }
    },
    handleFileUpload(files, index, i) {
      this.screeningData[index].filesData[i].file = files[0];
      this.screeningData[index].filesData[i].fileName = files[0].name;
    },
    addScreeningToMemeber(screening) {
      const screeningArray = [...screening];
      const screenDataArray = [];
      const filesArray = [];
      let formData = new FormData();
      const screeningFormData = screeningArray.slice();

      // const allScreeningCollection = [];
      // screeningFormData.forEach(screen => {
      //   allScreeningCollection.push(screen);
      // });
      // console.log(allScreeningCollection);
      // for (let key in this.censusScreenings) {
      //   allScreeningCollection.push(this.censusScreenings[key][0]);
      // }
      // console.log(allScreeningCollection);

      screeningFormData.forEach((screen, index) => {
        var screenObj = {};
        screenObj.insurance_company_id =
          screen.insurance_unique_id.insurance_company_id;
        screenObj.insurance_unique_id = screen.insurance_unique_id.id;
        screenObj.disease = screen.disease.id;
        screenObj.outcome_category = screen.outcome_category.id;
        screenObj.test_code = screen.test_code.title;
        screenObj.test_outcome = screen.test_outcome.id;
        if (screen.verbal_consent) {
          screenObj.verbal_consent = screen.verbal_consent.id;
        }
        screenObj.test_date = screen.test_date;
        if (screen.verbal_consent_date) {
          screenObj.verbal_consent_date = screen.verbal_consent_date;
        }
        if (screen.mobile_number) {
          screenObj.mobile_number = screen.mobile_number;
        }
        if (screen.insurance_network) {
          screenObj.insurance_network = screen.insurance_network;
        }
        if (screen.remark) {
          screenObj.remark = screen.remark;
        }
        if (screen.others) {
          screenObj.others = screen.others;
        }
        screen.filesData.forEach((fileData, i) => {
          let fileObj = {};
          fileObj.fileType = fileData.fileType && fileData.fileType.id;
          fileObj.file = fileData.file;
          filesArray.push(fileObj);
          formData.append("file[" + index + "][" + i + "]", fileData.file);
        });
        screenObj.filesData = filesArray.slice();
        screenDataArray.push(screenObj);
      });
      console.log(screenDataArray);
      formData.append("screening", JSON.stringify(screenDataArray));
      this.$store
        .dispatch("screening/addScreeningToMember", formData)
        .then(() => {
          if (!this.$store.state.screening.errors) {
            this.$toaster.success("Screening  added successfully.");
            this.$store.dispatch(
              "screening/getCensusScreening",
              this.$route.params.id
            );
            this.resetScreeningForm();
            this.$store.state.member.addScreen = false;
            return;
          }
          setTimeout(() => {
            var formErrors = this.$store.state.screening.errors;
            if (formErrors) {
              for (let key in formErrors) {
                this.$toaster.error(formErrors[key]);
              }
              formErrors = null;
              this.$store.state.screening.errors = null;
              return;
            }
          }, 500);
        });
    },
    removeScreeningDocument(index, i) {
      this.screeningData[index].filesData.splice(i, 1);
    },
    addNewScreeningDocument(index) {
      this.screeningData[index].filesData.push({
        fileType: null,
        file: null,
        fileName: null
      });
    },
    showVerbalConsentOther(verbalConsent) {
      if (verbalConsent && verbalConsent.id == 1) {
        this.verbalConsentOther = true;
      } else {
        this.verbalConsentOther = false;
      }
      if (verbalConsent && verbalConsent.id == 2) {
        this.makeMobileNumberRequired = true;
      } else {
        this.makeMobileNumberRequired = false;
      }
    },
    checkScreeningFormValidaity(index = 0) {
      this.screeningData.forEach(screen => {
        if (
          screen.test_outcome === 2 &&
          screen.verbal_consent &&
          screen.verbal_consent_date
        ) {
          this.formValidaity = true;
          return;
        } else {
          this.formValidaity = false;
        }
        if (
          screen.test_outcome === 3 &&
          screen.verbal_consent == 1 &&
          screen.verbal_consent_date
        ) {
          this.formValidaity = true;
          return;
        } else {
          this.formValidaity = false;
        }
        if (
          screen.test_outcome === 3 &&
          screen.verbal_consent == 2 &&
          screen.verbal_consent_date &&
          document.getElementById("Screening Document" + index).value
        ) {
          this.formValidaity = true;
          return;
        } else {
          this.formValidaity = false;
        }
        if (
          screen.disease &&
          screen.outcome_category &&
          screen.test_date &&
          screen.test_code &&
          screen.test_outcome === 1
        ) {
          this.formValidaity = true;
          return;
        } else {
          this.formValidaity = false;
        }
      });
    },
    addScreeningRemark(remark) {
      this.$store
        .dispatch("screening/addRemark", {
          remark: remark
        })
        .then(() => {
          if (!this.$store.state.screening.errors) {
            this.$toaster.success("Remark added successfully");
            this.remark = "";
            $("#addRemarkModal")
              .modal("hide")
              .removeClass("in");
          } else {
            const errs = this.$store.state.screening.errors;
            for (let key in errs.data.file) {
              this.$toaster.error(errs.data.remark[key]);
            }
            this.$store.state.screening.errors = null;
          }
        });
    },
    setScreeningId(screening) {
      this.$store.state.screening.diseaseID = screening.disease;
    },
    getPspStatusData(screening) {
      this.editedPspStatus = Object.assign({}, screening);
    },
    getScreeningRemarks(screening) {
      this.$store
        .dispatch("screening/getRemarks", screening.disease)
        .then(() => {
          this.diseaseRemarks = this.$store.state.screening.screeningRemarks;
        });
    },
    getScreeningDocuments(screening) {
      this.$store
        .dispatch("screening/getDocuments", screening.disease)
        .then(() => {
          this.diseaseDocuments = this.$store.state.screening.screeningDocuments;
        });
    },
    checkPspVerbalStatus(screening, index) {
      let pspCounter = 0;
      if (
        screening.disease &&
        screening.insurance_unique_id &&
        screening.verbal_consent
      ) {
        this.screeningData.forEach((screen, screenIndex) => {
          if (
            screen.disease === screening.disease &&
            screen.insurance_unique_id === screening.insurance_unique_id
          ) {
            if (screen.verbal_consent != screening.verbal_consent) {
              pspCounter++;
            }
          }
        });
      }
      if (pspCounter != 0) {
        this.pspDuplicate = true;
        this.pspIndex = index;
      } else {
        this.pspDuplicate = false;
      }
    },
    checkDateValidty(index) {
      this.sectionIndex = index;
      var startDate = "";
      var endDate = "";
      var termDate = "";
      if (!this.screeningData[this.sectionIndex].insurance_unique_id) {
        return;
      }
      if (
        typeof this.screeningData[this.sectionIndex].insurance_unique_id ===
        "object"
      ) {
        var insuranceNumber = this.screeningData[
          this.sectionIndex
        ].insurance_unique_id.name.split(" ");
        if (this.memberScreeningData) {
          this.memberScreeningData.insurances.forEach(ins => {
            if (ins.insurance_unique_id == insuranceNumber[0]) {
              startDate = moment(ins.policy_start_date, "DD/MM/YYYY");
              endDate = moment(ins.policy_end_date, "DD/MM/YYYY");
              if (ins.policy_termination_date) {
                termDate = moment(ins.policy_termination_date, "DD/MM/YYYY");
              }
            }
          });
        }
        var today = moment(new Date(), "DD/MM/YYYY");
        var screenTestDate = moment(
          document.getElementById("Screening Test Date" + this.sectionIndex)
            .value,
          "DD/MM/YYYY"
        );
        var pspVerbalDate = moment(
          document.getElementById("PSP Verbal Consent Date" + this.sectionIndex)
            .value,
          "DD/MM/YYYY"
        );
        // console.log("today", today);
        // console.log("startDate", startDate);
        // console.log("endDate", endDate);
        // console.log("termDate", termDate);
        // console.log("screenTestDate", screenTestDate);
        // console.log("pspVerbalDate", pspVerbalDate);

        if (screenTestDate.isValid()) {
          this.testDateValid = !(
            screenTestDate.isBefore(today) &&
            screenTestDate.isSameOrAfter(startDate) &&
            (screenTestDate.isSameOrBefore(endDate) ||
              screenTestDate.isSameOrBefore(termDate))
          );
        }
        if (screenTestDate.isValid() && pspVerbalDate.isValid()) {
          this.pspDateValid = !(
            pspVerbalDate.isBefore(today) &&
            pspVerbalDate.isSameOrAfter(startDate) &&
            pspVerbalDate.isSameOrAfter(screenTestDate) &&
            (pspVerbalDate.isSameOrBefore(endDate) ||
              pspVerbalDate.isSameOrBefore(termDate))
          );
        }
      }
    },
    checkTestOutCome(index) {
      if (this.screeningData[index].test_outcome === 1) {
        this.screeningData[index].verbal_consent = "";
        this.screeningData[index].verbal_consent_date = "";
        const input = document.getElementById("Screening Document" + index);
        input.type = "text";
        input.type = "file";
      }
    },
    uploadScreengDocument(index, event) {
      setTimeout(() => {
        if (!this.errors.has("Screening Document" + index)) {
          var formData = new FormData();
          this.screeningData[index].document = event.target.files[0];
          formData.append("file", event.target.files[0]);
          this.$store
            .dispatch("screening/uploadScreeningDocument", formData)
            .then(() => console.log(this.$store.state.screening.documentData));
        }
      }, 250);
    },
    addNewScreening() {
      this.screeningData.push({
        insurance_unique_id: null,
        disease: null,
        outcome_category: null,
        test_date: "",
        test_code: null,
        test_outcome: null,
        verbal_consent: null,
        verbal_consent_date: null,
        mobile_number: "",
        insurance_network: "",
        remark: "",
        others: "",
        filesData: [
          {
            fileType: null,
            file: null
          }
        ]
      });
    },
    remove(screening, index) {
      if (index === 0 || this.testDateValid || this.pspDateValid) {
        return false;
      }
      this.screeningData.splice(this.screeningData.indexOf(screening), 1);
    },
    onSearch(search, loading) {
      loading(true);
      this.search(loading, search, this);
    },
    search(loading, search, vm) {
      // setTimeout(() => {
      //   axios
      //     .get(`/census/screening/testCodes?q=${escape(search)}`)
      //     .then(res => {
      //       vm.testCodes = res.data.testCodes;
      //       loading(false);
      //       if (vm.testCodes.length === 0) {
      //         document.getElementsByClassName("no-options")[0].textContent =
      //           "No data to show";
      //       }
      //     });
      // }, 1000);
    },
    resetScreeningForm() {
      this.screeningData = [
        {
          insurance_unique_id: null,
          disease: null,
          outcome_category: null,
          test_date: "",
          test_code: null,
          test_outcome: null,
          verbal_consent: null,
          verbal_consent_date: "",
          mobile_number: "",
          insurance_network: "",
          remark: "",
          others: "",
          filesData: [
            {
              fileType: null,
              file: null
            }
          ]
        }
      ];
      setTimeout(() => {
        this.errors.clear();
      }, 100);
    },
    getFirstInsuanceID() {
      if (this.insurancesUnquieIds) {
        return this.insurancesUnquieIds.filter((insUnquieId, index) => {
          return index === 0;
        })[0].insurance_unique_id;
      }
    },
    setInitalOrConfirmOutCome(testCategoryValue) {
      if (+testCategoryValue.id === 1) {
        this.showInitalTestOutcome = true;
      } else {
        this.showInitalTestOutcome = false;
      }
    }
  },

  components: {
    Datepicker,
  },
  computed: {
    isFormInvalid() {
      return Object.keys(this.fields).some(key => this.fields[key].invalid);
    },
    isTestDocumentInvalid() {
      if (this.fields["Test Document"]) {
        return this.fields["Test Document"].invalid;
      }
    },
    isRemarkInvalid() {
      if (this.fields["Remark"]) {
        return this.fields["Remark"].invalid;
      }
    },
    isPSPInvalid() {
      if (this.fields["Written consent"]) {
        return this.fields["Written consent"].invalid;
      }
    },
    user() {
      return {
        status: 1,
        title: null,
        type: 0,
        type_id: null,
      };
    }
  },
};
</script>

<style scoped>
.input-group > .form-control,
.input-group > .custom-select,
.input-group > .custom-file {
  width: 91%;
}
#screening .dropdown-toggle::after {
  display: none !important;
}
.form-group, h4, .col {
  text-align: left
}
</style>
