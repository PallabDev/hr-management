import React, { useState, useRef } from "react";

import "./Apply.css"; // Make sure this is imported

type FormDataType = {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    address: string;
    dob: string;
    gender: string;

    highestQualification: string;
    instituteName: string;
    yearOfCompletion: string;
    fieldOfStudy: string;

    bankName: string;
    accountNumber: string;
    accountHolderName: string;
    ifscCode: string;

    resume: File | null;
    idProof: File | null;
    additionalDocument: File | null;
};

const Apply: React.FC = () => {
    const [formData, setFormData] = useState<FormDataType>({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        address: "",
        dob: "",
        gender: "",

        highestQualification: "",
        instituteName: "",
        yearOfCompletion: "",
        fieldOfStudy: "",

        bankName: "",
        accountNumber: "",
        accountHolderName: "",
        ifscCode: "",

        resume: null,
        idProof: null,
        additionalDocument: null,
    });

    const resumeInputRef = useRef<HTMLInputElement>(null);
    const idProofInputRef = useRef<HTMLInputElement>(null);
    const additionalDocsInputRef = useRef<HTMLInputElement>(null);


    const [fileNames, setFileNames] = useState({
        resume: "No file chosen",
        idProof: "No file chosen",
        additionalDocument: "No file chosen",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === "file") {
            const target = e.target as HTMLInputElement;
            const files = target.files;
            if (files && files[0]) {
                setFormData((prev) => ({
                    ...prev,
                    [name]: files[0],
                }));

                setFileNames((prev) => ({
                    ...prev,
                    [name]: files[0].name,
                }));
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const validate = () => {
        const requiredfieldOfStudys: (keyof FormDataType)[] = [
            "firstname",
            "lastname",
            "email",
            "phone",
            "address",
            "dob",
            "gender",
            "highestQualification",
            "instituteName",
            "yearOfCompletion",
            "fieldOfStudy",
            "bankName",
            "accountNumber",
            "accountHolderName",
            "ifscCode",
            "resume",
            "idProof",
        ];

        for (let fieldOfStudy of requiredfieldOfStudys) {
            const value = formData[fieldOfStudy];
            if (value === "" || value === null) {
                alert(`${fieldOfStudy} is required.`);
                return false;
            }
        }

        if (!/^\d+$/.test(formData.phone)) {
            alert("Phone must be a valid number");
            return false;
        }

        if (!/^\d+$/.test(formData.yearOfCompletion)) {
            alert("yearOfCompletion of completion must be a valid number");
            return false;
        }

        if (formData.resume && formData.resume.size > 5 * 1024 * 1024) {
            alert("Resume file must be less than 5MB");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        const data = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            if (value instanceof File) {
                data.append(key, value);
            } else if (typeof value === "string") {
                data.append(key, value);
            }
        });

        try {
            const response = await fetch("http://localhost:3000/api/v1/user/apply", {
                method: "POST",
                body: data,
            });

            if (!response.ok) throw new Error("Failed to submit form");

            alert("Form submitted successfully!");
            setFormData({
                firstname: "",
                lastname: "",
                email: "",
                phone: "",
                address: "",
                dob: "",
                gender: "",

                highestQualification: "",
                instituteName: "",
                yearOfCompletion: "",
                fieldOfStudy: "",

                bankName: "",
                accountNumber: "",
                accountHolderName: "",
                ifscCode: "",

                resume: null,
                idProof: null,
                additionalDocument: null,
            });

            // Optional: If you're using refs for file inputs, reset them too:
            if (resumeInputRef.current) resumeInputRef.current.value = "";
            if (idProofInputRef.current) idProofInputRef.current.value = "";
            if (additionalDocsInputRef.current) additionalDocsInputRef.current.value = "";
        } catch (error) {
            console.error("Submission error:", error);
            alert("Form submission failed. Please try again.");
        }
    };

    return (
        <div className="apply-container">
            <h2 className="apply-title">Application Form</h2>
            <form onSubmit={handleSubmit} className="apply-form">
                {/* Personal Info */}
                <section className="apply-section">
                    <h3 className="apply-section-title">Personal Information</h3>
                    <div className="apply-grid">
                        <input name="firstname" placeholder="First Name" value={formData.firstname} onChange={handleChange} required />
                        <input name="lastname" placeholder="Last Name" value={formData.lastname} onChange={handleChange} required />
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                        <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
                        <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
                        <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                        <select name="gender" value={formData.gender} onChange={handleChange} required>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </section>

                {/* Education */}
                <section className="apply-section">
                    <h3 className="apply-section-title">Education</h3>
                    <div className="apply-grid">
                        <input name="highestQualification" placeholder="Qualification" value={formData.highestQualification} onChange={handleChange} required />
                        <input name="instituteName" placeholder="Institute Name" value={formData.instituteName} onChange={handleChange} required />
                        <input type="number" name="yearOfCompletion" placeholder="Year of Completion" value={formData.yearOfCompletion} onChange={handleChange} required />
                        <input name="fieldOfStudy" placeholder="Study" value={formData.fieldOfStudy} onChange={handleChange} required />
                    </div>
                </section>

                {/* Bank Info */}
                <section className="apply-section">
                    <h3 className="apply-section-title">Bank Information</h3>
                    <div className="apply-grid">
                        <input name="bankName" placeholder="Bank Name" value={formData.bankName} onChange={handleChange} required />
                        <input name="accountNumber" placeholder="Account Number" value={formData.accountNumber} onChange={handleChange} required />
                        <input name="accountHolderName" placeholder="Holder Name" value={formData.accountHolderName} onChange={handleChange} required />
                        <input name="ifscCode" placeholder="ifsc Code" value={formData.ifscCode} onChange={handleChange} required />
                    </div>
                </section>

                {/* Files */}
                <section className="apply-section">
                    <h3 className="apply-section-title">Upload Documents</h3>
                    <div className="apply-grid">
                        <div className="apply-file-wrapper">
                            <label htmlFor="resume" className="apply-file-label">
                                Upload Resume
                                <input ref={resumeInputRef} id="resume" className="apply-file-input" type="file" name="resume" accept=".pdf,.doc,.docx" onChange={handleChange} required />
                            </label>
                            <span className="apply-file-name">{fileNames.resume}</span>
                        </div>

                        <div className="apply-file-wrapper">
                            <label htmlFor="idProof" className="apply-file-label">
                                Upload ID Proof
                                <input ref={idProofInputRef} id="idProof" className="apply-file-input" type="file" name="idProof" accept=".pdf,.png,.jpg,.jpeg" onChange={handleChange} required />
                            </label>
                            <span className="apply-file-name">{fileNames.idProof}</span>
                        </div>

                        <div className="apply-file-wrapper">
                            <label htmlFor="additionalDocument" className="apply-file-label">
                                Additional Documents (Optional)
                                <input ref={additionalDocsInputRef} id="additionalDocument" className="apply-file-input" type="file" name="additionalDocument" accept=".pdf,.png,.jpg,.jpeg" onChange={handleChange} />
                            </label>
                            <span className="apply-file-name">{fileNames.additionalDocument}</span>
                        </div>
                    </div>
                </section>

                <button type="submit" className="apply-submit-button">Submit Application</button>
            </form>
        </div>
    );
};

export default Apply;
