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
            insurancesUnquieIds: ['a', 'b'],
            screeningTypes: ['c', 'd'],
            screeningCategories: ['e', 'f'],
            testCodes: ['g', 'h'],
            screeningTestOutcomesArray: ['i', 'j'],
            pspVerbalConcentTypes: ['k', 'l'],
            screeningDocumentTypesArray: ['m', 'n']
        }
    }
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
