import { useEffect, useState } from "react";
import axios from "axios";

interface Submission {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: number;
    address: string;
    dob: string;
    gender: string;
    applicationStatus: string;
    qualification: {
        highestQualification: string;
        instituteName: string;
        yearOfCompletion: number;
        fieldOfStudy: string;
    };
    bankDetails: {
        bankName: string;
        accountNumber: string;
        accountHolderName: string;
        ifscCode: string;
    };
    documents: {
        resume: string;
        idProof: string;
        additionalDocuments: string;
    };
}

const Dashboard = () => {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [filter, setFilter] = useState<string>("");
    const [search, setSearch] = useState<string>("");
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSubmissions = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get("/api/v1/user/get-submisison", {
                withCredentials: true,
            });
            if (res.data.success) {
                setSubmissions(res.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch submissions", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.get("/api/v1/user/logout", {
                withCredentials: true,
            });
            window.location.href = "/login";
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            await axios.patch(`/api/v1/user/update-status/${id}`, { status }, {
                withCredentials: true,
            });
            fetchSubmissions();
            setSelectedSubmission(null);
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const filteredSubmissions = submissions.filter((submission) => {
        const matchesSearch =
            submission.firstname.toLowerCase().includes(search.toLowerCase()) ||
            submission.lastname.toLowerCase().includes(search.toLowerCase()) ||
            submission.email.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter ? submission.applicationStatus === filter : true;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-gray-50 font-['Inter',sans-serif]">
            {/* Top Navigation */}
            <nav className="bg-white border-b border-gray-200 p-4 shadow-sm">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-semibold text-gray-900">Admin Portal</h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                        <span>Logout</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Applications</h2>
                    <p className="text-gray-500">Manage all submitted applications</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-4 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search applications..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-700 placeholder-gray-400"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="w-full md:w-48">
                            <select
                                className="block w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-700"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Applications Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                                <div className="h-8 bg-gray-200 rounded w-24"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredSubmissions.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSubmissions.map((submission) => (
                            <div
                                key={submission._id}
                                className="bg-white rounded-xl border border-gray-200 hover:border-indigo-300 p-5 transition-all cursor-pointer hover:shadow-md"
                                onClick={() => setSelectedSubmission(submission)}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {submission.firstname} {submission.lastname}
                                        </h3>
                                        <p className="text-sm text-gray-500">{submission.email}</p>
                                    </div>
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${submission.applicationStatus === 'approved'
                                            ? 'bg-green-100 text-green-800'
                                            : submission.applicationStatus === 'rejected'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}
                                    >
                                        {submission.applicationStatus.charAt(0).toUpperCase() + submission.applicationStatus.slice(1)}
                                    </span>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center text-sm text-gray-500 mb-1">
                                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        {submission.qualification.highestQualification}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Completed: {submission.qualification.yearOfCompletion}
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                                    <button
                                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedSubmission(submission);
                                        }}
                                    >
                                        View details →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No applications found</h3>
                        <p className="mt-1 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
                    </div>
                )}
            </div>

            {/* Application Detail Modal */}
            {selectedSubmission && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-start z-50 overflow-y-auto p-4">
                    <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl mt-12 mb-12 animate-fade-in-up">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900">
                                Application Details
                            </h3>
                            <button
                                className="text-gray-400 hover:text-gray-500 transition-colors"
                                onClick={() => setSelectedSubmission(null)}
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Personal Information</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">Full Name</p>
                                            <p className="text-sm text-gray-900">{selectedSubmission.firstname} {selectedSubmission.lastname}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">Email Address</p>
                                            <p className="text-sm text-gray-900">{selectedSubmission.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">Phone Number</p>
                                            <p className="text-sm text-gray-900">{selectedSubmission.phone}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">Date of Birth</p>
                                            <p className="text-sm text-gray-900">{new Date(selectedSubmission.dob).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">Gender</p>
                                            <p className="text-sm text-gray-900">{selectedSubmission.gender}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">Address</p>
                                            <p className="text-sm text-gray-900">{selectedSubmission.address}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Education Details</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">Highest Qualification</p>
                                            <p className="text-sm text-gray-900">{selectedSubmission.qualification.highestQualification}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">Institute Name</p>
                                            <p className="text-sm text-gray-900">{selectedSubmission.qualification.instituteName}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">Field of Study</p>
                                            <p className="text-sm text-gray-900">{selectedSubmission.qualification.fieldOfStudy}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">Year of Completion</p>
                                            <p className="text-sm text-gray-900">{selectedSubmission.qualification.yearOfCompletion}</p>
                                        </div>
                                    </div>

                                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mt-6 mb-3">Bank Details</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">Bank Name</p>
                                            <p className="text-sm text-gray-900">{selectedSubmission.bankDetails.bankName}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">Account Number</p>
                                            <p className="text-sm text-gray-900">{selectedSubmission.bankDetails.accountNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">Account Holder</p>
                                            <p className="text-sm text-gray-900">{selectedSubmission.bankDetails.accountHolderName}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">IFSC Code</p>
                                            <p className="text-sm text-gray-900">{selectedSubmission.bankDetails.ifscCode}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mt-6 mb-3">Documents</h4>
                            <div className="flex flex-wrap gap-3">
                                <a
                                    href={selectedSubmission.documents.resume}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    Resume
                                </a>
                                <a
                                    href={selectedSubmission.documents.idProof}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    ID Proof
                                </a>
                                <a
                                    href={selectedSubmission.documents.additionalDocuments}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Additional Documents
                                </a>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end space-x-3">
                            <button
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                onClick={() => setSelectedSubmission(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
                                onClick={() => handleStatusUpdate(selectedSubmission._id, "rejected")}
                            >
                                Reject Application
                            </button>
                            <button
                                className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
                                onClick={() => handleStatusUpdate(selectedSubmission._id, "approved")}
                            >
                                Approve Application
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;