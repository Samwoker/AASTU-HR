import React, { useState } from "react";
import {
  MdPerson,
  MdContactPhone,
  MdSchool,
  MdWork,
  MdVerifiedUser,
  MdAttachMoney,
  MdUploadFile,
  MdEdit,
  MdCameraAlt,
} from "react-icons/md";
import ProfileSidebar from "./ProfileSidebar";
import PersonalDetails from "./sections/PersonalDetails";
import ContactDetails from "./sections/ContactDetails";
import EducationWrapper from "./sections/EducationWrapper";
import WorkExperienceWrapper from "./sections/WorkExperienceWrapper";
import CertificationsWrapper from "./sections/CertificationsWrapper";
import FinancialDetails from "./sections/FinancialDetails";
import JobDetails from "./sections/JobDetails";
import DocumentsWrapper from "./sections/DocumentsWrapper";
import Modal from "../../../components/common/Modal";
import Button from "../../../components/common/Button";
import toast from "react-hot-toast";
import EmployeeLayout from "../../../components/layout/EmployeeLayout";
import PageHeader from "../../../components/common/PageHeader";

export default function ProfileUpdateLayout() {
  const [activeSection, setActiveSection] = useState("personal");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSaveImage = () => {
    // TODO: Implement API call to upload image
    console.log("Uploading image:", selectedImage);
    toast.success("Profile image updated successfully");
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "personal":
        return <PersonalDetails />;
      case "contact":
        return <ContactDetails />;
      case "education":
        return <EducationWrapper />;
      case "workExperience":
        return <WorkExperienceWrapper />;
      case "certifications":
        return <CertificationsWrapper />;
      case "financial":
        return <FinancialDetails />;
      case "job":
        return <JobDetails />;
      case "documents":
        return <DocumentsWrapper />;
      default:
        return <PersonalDetails />;
    }
  };

  return (
    <EmployeeLayout>
      <div className="min-h-screen pb-12">
        {/* Header Banner */}
        <PageHeader className="rounded-b-3xl -mx-6 md:-mx-8 -mt-6 md:-mt-8 mb-8 pt-8 pb-24 h-52">
          <div className="max-w-7xl mx-auto relative z-10">
            <h1 className="text-3xl font-bold mb-2">My Profile</h1>
            <p className="text-gray-300">
              Manage your personal information and employment details
            </p>
          </div>
        </PageHeader>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Sidebar */}
            <div className="w-full lg:w-80 shrink-0 lg:sticky lg:top-24 self-start">
              {/* Profile Card */}
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 text-center">
                <div className="relative inline-block mx-auto mb-4 group">
                  <div className="w-24 h-24 rounded-full bg-k-yellow border-4 border-white overflow-hidden shadow-lg">
                    <img
                      src="https://avatar.iran.liara.run/public/boy"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="absolute bottom-0 right-0 bg-k-orange text-white p-2 rounded-full shadow-md hover:bg-orange-600 transition-colors cursor-pointer"
                    title="Update Profile Picture"
                  >
                    <MdCameraAlt size={16} />
                  </button>
                </div>
                <h2 className="text-xl font-bold text-k-dark-grey">
                  Tesfamichael Tafere
                </h2>
                <p className="text-k-medium-grey text-sm mb-4">
                  Software Engineer
                </p>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                  Active Employee
                </div>
              </div>

              <ProfileSidebar
                activeSection={activeSection}
                onSectionChange={setActiveSection}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0 w-full">{renderSection()}</div>
          </div>
        </div>

        {/* Image Upload Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedImage(null);
          }}
          title="Update Profile Picture"
        >
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {selectedImage ? (
                <div className="text-center">
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Preview"
                    className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow-md"
                  />
                  <p className="text-sm font-medium text-k-dark-grey">
                    {selectedImage.name}
                  </p>
                  <p className="text-xs text-gray-500">Click to change</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MdCameraAlt size={32} />
                  </div>
                  <p className="text-sm font-medium text-k-dark-grey">
                    Click to upload image
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG up to 5MB
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedImage(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveImage}
                disabled={!selectedImage}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </EmployeeLayout>
  );
}
