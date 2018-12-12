<template>
    <add-screening 
        :insurancesUnquieIds="insurancesUnquieIds"
        :screeningTypes="screeningTypes"
        :screeningCategories="screeningCategories"
        :testCodes="testCodes"
        :screeningTestOutcomesArray="screeningTestOutcomesArray"
        :pspVerbalConcentTypes="pspVerbalConcentTypes"
        :screeningDocumentTypesArray="screeningDocumentTypesArray">
    </add-screening>
</template>

<script>
import addScreening from 'vue-add-screening-example-tahtawy/AddScreening.vue';

export default {
    components: {
        addScreening
    },
    data() {
        return {
        }
    },
    mounted() {
        this.$store.dispatch("screening/getScreeningLookUp", this.$route.params.id);
        this.$store.dispatch("screening/getMemberByID", this.$route.params.id);
        this.$store.dispatch("screening/getCensusScreening", this.$route.params.id);
        this.$store.dispatch("screening/getPspData");
    },
    computed:{
        insurancesUnquieIds() {
            const insuranceUnqiueNumbers = this.$store.state.screening
            .insurancesUnquieIds;
            console.log('insuranceUnqiueNumbers', insuranceUnqiueNumbers);
            const insuranceUnqiueNumberArray = [];
            if (insuranceUnqiueNumbers) {
            insuranceUnqiueNumbers.forEach(insuranceNum => {
                const obj = {
                id: insuranceNum.id,
                name:
                    insuranceNum.insurance_unique_id +
                    " " +
                    insuranceNum.policy_id +
                    " " +
                    insuranceNum.policy_start_date +
                    " " +
                    insuranceNum.policy_end_date,
                insurance_company_id: insuranceNum.insurance_company_id,
                mobile_number: insuranceNum.mobile_number,
                insurance_network: insuranceNum.insurance_network
                };
                insuranceUnqiueNumberArray.push(obj);
            });
            }
            return insuranceUnqiueNumberArray;
        },
        screeningTypes() {
            const screeningTypes = this.$store.state.screening.screeningTypes;
            const screeningTypesArray = [];
            if (screeningTypes) {
            for (const key in screeningTypes) {
                const obj = {
                id: key,
                name: screeningTypes[key]
                };
                screeningTypesArray.push(obj);
            }
            }
            return screeningTypesArray;
        },
        screeningCategories() {
            const screeningCategories = this.$store.state.screening
            .screeningCategories;
            const screeningCategoriesArray = [];
            if (screeningCategories) {
            for (const key in screeningCategories) {
                const obj = {
                id: key,
                name: screeningCategories[key]
                };
                screeningCategoriesArray.push(obj);
            }
            }
            return screeningCategoriesArray;
        },
        testCodes() {
            return [
            {id: 1, title: '11111'},
            {id: 2, title: '00000'},
            {id: 3, title: '2222'},
            {id: 4, title: '3333'},
            {id: 5, title: '4444'},
            {id: 6, title: '5555'},
            ]
        },
        pspVerbalConcentTypes() {
            const pspVerbalConcentTypes = this.$store.state.screening
            .pspVerbalConcentTypes;
            const pspVerbalConcentTypesArray = [];
            if (pspVerbalConcentTypes) {
            for (const key in pspVerbalConcentTypes) {
                const obj = {
                id: key,
                name: pspVerbalConcentTypes[key]
                };
                pspVerbalConcentTypesArray.push(obj);
            }
            }
            return pspVerbalConcentTypesArray;
        },
        screeningDocumentTypesArray() {
            return [
                { id: 1, name: "PSP Consent" },
                { id: 2, name: "Treatment Plan" },
                { id: 3, name: "Initial Screening Results" },
                { id: 5, name: "Others" }
            ]
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
