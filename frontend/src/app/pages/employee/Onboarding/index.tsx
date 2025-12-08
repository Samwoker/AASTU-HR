import { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import EmployeeLayout from "../../../components/DefaultLayout/EmployeeLayout";
import Button from "../../../components/common/Button";
import { RootState } from "../../../../store/types/RootState";
import {
  updateField,
  updateArrayField,
  updatePhone,
  addField,
  addPhone,
  updateFile,
  nextStep,
  prevStep,
} from "../../../slice/onboardingSlice";

interface StepIndicatorProps {
  step: number;
}

interface InputProps {
  label: string;
  name?: string;
  value: string;
  type?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

// Step Indicator Component
function StepIndicator({ step }: StepIndicatorProps) {
  const steps = [
    "Personal Info",
    "Address & Contact",
    "Education",
    "Work Experience",
    "Certificates",
    "Documents",
    "Review",
  ];

  return (
    <div className="bg-white shadow-lg p-6 rounded-2xl mb-8 border border-gray-100">
      <div className="overflow-x-auto -mx-4 px-4">
        <div className="flex items-center justify-start gap-4 md:gap-8 min-w-max py-2">
          {steps.map((label, i) => {
            const stepNumber = i + 1;
            const isActive = step === stepNumber;
            const isCompleted = step > stepNumber;

            return (
              <div key={stepNumber} className="flex flex-col items-center shrink-0">
                <div
                  className={`
                    w-12 h-12 flex items-center justify-center rounded-full font-bold text-sm
                    transition-all duration-300 shadow-md
                    ${
                      isActive
                        ? "bg-gradient-to-r from-[#DB5E00] to-[#FFCC00] text-white scale-110"
                        : isCompleted
                        ? "bg-gradient-to-r from-green-500 to-green-400 text-white"
                        : "bg-gray-100 text-gray-500 border-2 border-gray-200"
                    }
                  `}
                >
                  {isCompleted ? "✓" : stepNumber}
                </div>
                <p
                  className={`text-xs mt-3 w-20 text-center font-medium transition-colors ${
                    isActive ? "text-[#DB5E00]" : isCompleted ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Simple Input Component for the form
function FormInput({ label, name, value, type = "text", onChange }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-gray-700 font-semibold text-sm">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="border border-gray-200 w-full px-4 py-3 rounded-xl outline-none 
                   focus:ring-2 focus:ring-[#DB5E00]/20 focus:border-[#DB5E00] 
                   transition-all duration-200 bg-gray-50 hover:bg-white"
      />
    </div>
  );
}

export default function EmployeeOnboarding() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const step = useSelector((state: RootState) => state.onboarding.step);
  const form = useSelector((state: RootState) => state.onboarding.form);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    dispatch(updateField({ name: e.target.name as keyof typeof form, value: e.target.value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert("Onboarding Completed!");
    navigate("/employee/dashboard");
  };

  return (
    <EmployeeLayout>
      <div className="max-w-4xl mx-auto p-4 md:p-0 w-full overflow-x-hidden">
        <StepIndicator step={step} />

        <div className="mt-6 bg-white shadow-lg p-6 md:p-10 rounded-2xl border border-gray-100">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Employee Onboarding</h1>
            <p className="text-gray-500 mt-2">Complete your profile information to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* STEP 1: Personal Info */}
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                />
                <FormInput
                  label="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                />
                <FormInput
                  label="Date of Birth"
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                />
                <FormInput
                  label="Gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                />
                <FormInput
                  label="Marital Status"
                  name="maritalStatus"
                  value={form.maritalStatus}
                  onChange={handleChange}
                />
              </div>
            )}

            {/* STEP 2: Address & Contact */}
            {step === 2 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                  />
                  <FormInput
                    label="City"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="mt-6">
                  <label className="font-semibold text-gray-700 text-sm">Phone Numbers</label>

                  {form.phones.map((ph, i) => (
                    <input
                      key={i}
                      value={ph}
                      onChange={(e) =>
                        dispatch(updatePhone({ index: i, value: e.target.value }))
                      }
                      className="border border-gray-200 w-full px-4 py-3 rounded-xl mt-3 outline-none 
                                 focus:ring-2 focus:ring-[#DB5E00]/20 focus:border-[#DB5E00] 
                                 transition-all duration-200 bg-gray-50 hover:bg-white"
                      placeholder={`Phone ${i + 1}`}
                    />
                  ))}

                  <button
                    type="button"
                    onClick={() => dispatch(addPhone())}
                    className="text-[#DB5E00] mt-4 font-semibold hover:text-[#FFCC00] transition-colors"
                  >
                    + Add Phone
                  </button>
                </div>
              </>
            )}

            {/* STEP 3: Education */}
            {step === 3 && (
              <>
                {form.education.map((edu, i) => (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-gray-50 rounded-xl">
                    <FormInput
                      label="School"
                      value={edu.school}
                      onChange={(e) =>
                        dispatch(
                          updateArrayField({
                            field: "education",
                            index: i,
                            key: "school",
                            value: e.target.value,
                          })
                        )
                      }
                    />
                    <FormInput
                      label="Degree"
                      value={edu.degree}
                      onChange={(e) =>
                        dispatch(
                          updateArrayField({
                            field: "education",
                            index: i,
                            key: "degree",
                            value: e.target.value,
                          })
                        )
                      }
                    />
                    <FormInput
                      label="Year"
                      value={edu.year}
                      onChange={(e) =>
                        dispatch(
                          updateArrayField({
                            field: "education",
                            index: i,
                            key: "year",
                            value: e.target.value,
                          })
                        )
                      }
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    dispatch(
                      addField({
                        field: "education",
                        empty: { school: "", degree: "", year: "" },
                      })
                    )
                  }
                  className="text-[#DB5E00] font-semibold hover:text-[#FFCC00] transition-colors"
                >
                  + Add Education
                </button>
              </>
            )}

            {/* STEP 4: Work Experience */}
            {step === 4 && (
              <>
                {form.work.map((job, i) => (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-gray-50 rounded-xl">
                    <FormInput
                      label="Company"
                      value={job.company}
                      onChange={(e) =>
                        dispatch(
                          updateArrayField({
                            field: "work",
                            index: i,
                            key: "company",
                            value: e.target.value,
                          })
                        )
                      }
                    />
                    <FormInput
                      label="Job Title"
                      value={job.title}
                      onChange={(e) =>
                        dispatch(
                          updateArrayField({
                            field: "work",
                            index: i,
                            key: "title",
                            value: e.target.value,
                          })
                        )
                      }
                    />
                    <FormInput
                      label="Years"
                      value={job.years}
                      onChange={(e) =>
                        dispatch(
                          updateArrayField({
                            field: "work",
                            index: i,
                            key: "years",
                            value: e.target.value,
                          })
                        )
                      }
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    dispatch(
                      addField({
                        field: "work",
                        empty: { company: "", title: "", years: "" },
                      })
                    )
                  }
                  className="text-[#DB5E00] font-semibold hover:text-[#FFCC00] transition-colors"
                >
                  + Add Work Experience
                </button>
              </>
            )}

            {/* STEP 5: Certificates */}
            {step === 5 && (
              <>
                {form.certificates.map((cert, i) => (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-xl">
                    <FormInput
                      label="Certificate Name"
                      value={cert.name}
                      onChange={(e) =>
                        dispatch(
                          updateArrayField({
                            field: "certificates",
                            index: i,
                            key: "name",
                            value: e.target.value,
                          })
                        )
                      }
                    />
                    <FormInput
                      label="Issued By"
                      value={cert.org}
                      onChange={(e) =>
                        dispatch(
                          updateArrayField({
                            field: "certificates",
                            index: i,
                            key: "org",
                            value: e.target.value,
                          })
                        )
                      }
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    dispatch(
                      addField({
                        field: "certificates",
                        empty: { name: "", org: "" },
                      })
                    )
                  }
                  className="text-[#DB5E00] font-semibold hover:text-[#FFCC00] transition-colors"
                >
                  + Add Certificate
                </button>
              </>
            )}

            {/* STEP 6: Documents */}
            {step === 6 && (
              <div className="grid gap-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <label className="block font-semibold text-gray-700 mb-3">Profile Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      dispatch(
                        updateFile({
                          field: "photo",
                          file: e.target.files?.[0] || null,
                        })
                      )
                    }
                    className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#DB5E00] file:text-white file:font-semibold file:cursor-pointer hover:file:bg-[#FFCC00] transition-all"
                  />
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <label className="block font-semibold text-gray-700 mb-3">ID Card</label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) =>
                      dispatch(
                        updateFile({
                          field: "idCard",
                          file: e.target.files?.[0] || null,
                        })
                      )
                    }
                    className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#DB5E00] file:text-white file:font-semibold file:cursor-pointer hover:file:bg-[#FFCC00] transition-all"
                  />
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <label className="block font-semibold text-gray-700 mb-3">CV</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) =>
                      dispatch(
                        updateFile({
                          field: "cv",
                          file: e.target.files?.[0] || null,
                        })
                      )
                    }
                    className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#DB5E00] file:text-white file:font-semibold file:cursor-pointer hover:file:bg-[#FFCC00] transition-all"
                  />
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <label className="block font-semibold text-gray-700 mb-3">Recommendation Letter</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) =>
                      dispatch(
                        updateFile({
                          field: "recommendation",
                          file: e.target.files?.[0] || null,
                        })
                      )
                    }
                    className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#DB5E00] file:text-white file:font-semibold file:cursor-pointer hover:file:bg-[#FFCC00] transition-all"
                  />
                </div>
              </div>
            )}

            {/* STEP 7: Review */}
            {step === 7 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Review Your Information</h2>
                <pre className="bg-gray-50 p-6 rounded-xl border border-gray-200 max-h-96 overflow-auto text-sm">
                  {JSON.stringify(
                    {
                      ...form,
                      photo: form.photo?.name || null,
                      idCard: form.idCard?.name || null,
                      cv: form.cv?.name || null,
                      recommendation: form.recommendation?.name || null,
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-100">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => dispatch(prevStep())}
                >
                  Back
                </Button>
              ) : (
                <div />
              )}

              {step < 7 ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => dispatch(nextStep())}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  className="bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500"
                >
                  Submit Application
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </EmployeeLayout>
  );
}
