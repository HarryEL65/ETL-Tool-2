// import { ValidationMessage } from './import-types';
export interface ValidationMessage {
    testName: string;
    status: string;
}

export interface ValidationResultMessage {
    resultStatus: string;
    validationMessageArray: ValidationMessage[];
}

export interface EtlFile {
    key: string;
    fileName: string;
    affiliateProgramName; string;
    accName: string;
    legalCompany: string;
    recordType: string;
    effectiveDate: string;
    ValidationMessage: ValidationMessage;
}

export interface EtlFiles {
    files: EtlFiles[]
}