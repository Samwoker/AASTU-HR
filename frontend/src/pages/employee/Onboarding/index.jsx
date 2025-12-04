import EmployeeLayout from "../../../components/layout/EmployeeLayout";
import Button from "../../../components/ui/Button";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  updateField,
  updateArrayField,
  updatePhone,
  addField,
  addPhone,
  updateFile,
  nextStep,
  prevStep,
} from "../../../features/onboarding/onboardingSlice";

function StepIndicator({ step }) {
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
    <div className="bg-white shadow p-4 rounded-2xl mb-8">
      <div className="overflow-x-auto -mx-4 px-4">
        <div className="flex items-center justify-start gap-10 min-w-max py-2">
          {steps.map((label, i) => {
            const s = i + 1;
            return (
              <div key={s} className="flex flex-col items-center shrink-0">
                <div
                  className={`
                    w-10 h-10 flex items-center justify-center rounded-full font-semibold text-sm
                    ${
                      step === s
                        ? "bg-[#FFCC00] text-black"
                        : step > s
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-700"
                    }
                  `}
                >
                  {s}
                </div>
                <p className="text-[11px] md:text-xs mt-2 text-gray-600 w-20 text-center">
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

function Input({ label, name, value, type = "text", onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-gray-700 font-medium">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="border w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#FFCC00]"
      />
    </div>
  );
}

export default function EmployeeOnboarding() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const step = useSelector((state) => state.onboarding.step);
  const form = useSelector((state) => state.onboarding.form);

  const handleChange = (e) =>
    dispatch(updateField({ name: e.target.name, value: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Onboarding Completed!");
    navigate("/employee/dashboard");
  };

  return (
    <EmployeeLayout>
      <div className="max-w-4xl mx-auto p-4 md:p-0 w-full overflow-x-hidden">
        <StepIndicator step={step} />

        <div className="mt-6 bg-white shadow p-6 md:p-8 rounded-2xl">
          <h1 className="text-2xl font-bold mb-6">Employee Onboarding</h1>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* STEP 1 */}
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                />
                <Input
                  label="Date of Birth"
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                />
                <Input
                  label="Gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                />
                <Input
                  label="Marital Status"
                  name="maritalStatus"
                  value={form.maritalStatus}
                  onChange={handleChange}
                />
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                  />
                  <Input
                    label="City"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="font-medium">Phone Numbers</label>

                  {form.phones.map((ph, i) => (
                    <input
                      key={i}
                      value={ph}
                      onChange={(e) =>
                        dispatch(
                          updatePhone({ index: i, value: e.target.value })
                        )
                      }
                      className="border w-full px-4 py-3 rounded-xl mt-2"
                    />
                  ))}

                  <button
                    type="button"
                    onClick={() => dispatch(addPhone())}
                    className="text-[#DB5E00] mt-2 font-semibold"
                  >
                    + Add Phone
                  </button>
                </div>
              </>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <>
                {form.education.map((edu, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                  >
                    <Input
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
                    <Input
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
                    <Input
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
                  className="text-[#DB5E00] font-semibold"
                >
                  + Add Education
                </button>
              </>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <>
                {form.work.map((job, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                  >
                    <Input
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
                    <Input
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
                    <Input
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
                  className="text-[#DB5E00] font-semibold"
                >
                  + Add Work Experience
                </button>
              </>
            )}

            {/* STEP 5 */}
            {step === 5 && (
              <>
                {form.certificates.map((cert, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    <Input
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
                    <Input
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
                  className="text-[#DB5E00] font-semibold"
                >
                  + Add Certificate
                </button>
              </>
            )}

            {/* STEP 6 */}
            {step === 6 && (
              <div className="grid gap-6">
                <div>
                  <label>Profile Photo</label>
                  <input
                    type="file"
                    onChange={(e) =>
                      dispatch(
                        updateFile({
                          field: "photo",
                          file: e.target.files[0],
                        })
                      )
                    }
                  />
                </div>
                <div>
                  <label>ID Card</label>
                  <input
                    type="file"
                    onChange={(e) =>
                      dispatch(
                        updateFile({
                          field: "idCard",
                          file: e.target.files[0],
                        })
                      )
                    }
                  />
                </div>
                <div>
                  <label>CV</label>
                  <input
                    type="file"
                    onChange={(e) =>
                      dispatch(
                        updateFile({
                          field: "cv",
                          file: e.target.files[0],
                        })
                      )
                    }
                  />
                </div>
                <div>
                  <label>Recommendation Letter</label>
                  <input
                    type="file"
                    onChange={(e) =>
                      dispatch(
                        updateFile({
                          field: "recommendation",
                          file: e.target.files[0],
                        })
                      )
                    }
                  />
                </div>
              </div>
            )}

            {/* STEP 7 */}
            {step === 7 && (
              <pre className="bg-gray-100 p-4 rounded-xl border max-h-72 overflow-auto">
                {JSON.stringify(form, null, 2)}
              </pre>
            )}

            <div className="flex justify-between">
              {step > 1 ? (
                <Button
                  type="button"
                  onClick={() => dispatch(prevStep())}
                  className="bg-gray-300 px-6 py-3 rounded-xl"
                >
                  Back
                </Button>
              ) : (
                <div />
              )}

              {step < 7 ? (
                <Button
                  type="button"
                  onClick={() => dispatch(nextStep())}
                  className="bg-[#FFCC00] px-6 py-3 rounded-xl"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-3 rounded-xl"
                >
                  Submit
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </EmployeeLayout>
  );
}
