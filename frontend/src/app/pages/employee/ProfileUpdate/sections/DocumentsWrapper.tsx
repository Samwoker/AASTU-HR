import React, { useEffect, useState } from "react";
import StepDocuments from "../../../../components/employees/wizard/StepDocuments";
import Button from "../../../../components/common/Button";
import { MdSave, MdEdit } from "react-icons/md";
import toast from "react-hot-toast";
import onboardingService from "../../../../services/onboardingService";

export default function DocumentsWrapper({ initialDocuments, onRefresh }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    documents: {
      cv: [],
      certificates: [],
      photo: [],
      experienceLetters: [],
      taxForms: [],
      pensionForms: [],
    },
  });
  const [errors, setErrors] = useState({});

  const asFileItems = (value: any) => {
    const toName = (url: string) => {
      try {
        const withoutQuery = url.split("?")[0];
        const last = withoutQuery.split("/").filter(Boolean).pop();
        return last || "Document";
      } catch {
        return "Document";
      }
    };

    const normalizeOne = (item: any) => {
      if (!item) return null;
      if (typeof item === "string") {
        return { url: item, name: toName(item) };
      }
      if (typeof item === "object") {
        const url = item.url || item.path || item.location || "";
        if (typeof url === "string" && url) {
          return { ...item, url, name: item.name || toName(url) };
        }
        // already a FileItem-like object but without url
        return { ...item, name: item.name || "Document", url: "" };
      }
      return null;
    };

    if (Array.isArray(value)) {
      return value.map(normalizeOne).filter(Boolean);
    }
    if (!value) return [];
    return [normalizeOne(value)].filter(Boolean);
  };

  const linkGroups = (() => {
    const docs: any = formData.documents || {};
    const groups = [
      { key: "cv", label: "CV / Resume" },
      { key: "certificates", label: "Educational Certificates" },
      { key: "photo", label: "Photo / ID" },
      { key: "experienceLetters", label: "Work Experience Letters" },
      { key: "taxForms", label: "Tax Forms" },
      { key: "pensionForms", label: "Pension Forms" },
    ];

    const result = groups
      .map(({ key, label }) => {
        const items = asFileItems(docs[key]);
        const urls = items
          .map((it: any) => it?.url)
          .filter((u: any) => typeof u === "string" && u);
        if (urls.length === 0) return null;
        return { key, label, urls };
      })
      .filter(Boolean) as Array<{ key: string; label: string; urls: string[] }>;

    return result;
  })();

  useEffect(() => {
    if (!isEditing && initialDocuments) {
      setFormData((prev) => {
        const merged = { ...prev.documents, ...initialDocuments };
        return {
          ...prev,
          documents: {
            ...prev.documents,
            cv: asFileItems(merged.cv),
            certificates: asFileItems(merged.certificates),
            photo: asFileItems(merged.photo),
            experienceLetters: asFileItems(merged.experienceLetters),
            taxForms: asFileItems(merged.taxForms),
            pensionForms: asFileItems(merged.pensionForms),
          },
        };
      });
    }
  }, [initialDocuments, isEditing]);

  const updateFormData = (field, value) => {
    // If field is "documents", value is the new documents object
    if (field === "documents") {
      setFormData((prev) => ({ ...prev, documents: value }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const save = async () => {
      const loadingToast = toast.loading("Saving documents...");
      try {
        const extractUrl = (item) => {
          if (!item) return null;
          if (typeof item === "string") return item;
          if (item.url) return item.url;
          if (item.error) {
            throw new Error(
              `File \"${item.name || "file"}\" failed to upload: ${item.error}`
            );
          }
          return null;
        };

        const docs = formData.documents || {};
        const payloadDocs = {
          cv: (docs.cv || []).map(extractUrl).filter((u) => u),
          certificates: (docs.certificates || [])
            .map(extractUrl)
            .filter((u) => u),
          photo: (docs.photo || []).map(extractUrl).filter((u) => u),
          experienceLetters: (docs.experienceLetters || [])
            .map(extractUrl)
            .filter((u) => u),
          taxForms: (docs.taxForms || []).map(extractUrl).filter((u) => u),
          pensionForms: (docs.pensionForms || [])
            .map(extractUrl)
            .filter((u) => u),
        };

        await onboardingService.updateDocuments({ documents: payloadDocs });
        toast.dismiss(loadingToast);
        toast.success("Documents updated successfully");
        setIsEditing(false);
        if (onRefresh) await onRefresh();
      } catch (error) {
        toast.dismiss(loadingToast);
        const err = error as any;
        toast.error(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to update documents"
        );
      }
    };

    save();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 animate-[slideUp_0.3s_ease-out]">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-xl font-bold text-k-dark-grey">Documents</h2>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            icon={MdEdit}
            onClick={() => setIsEditing(true)}
          >
            Edit Documents
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className={!isEditing ? "pointer-events-none opacity-80" : ""}>
          <StepDocuments
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        </div>

        {!isEditing && linkGroups.length > 0 && (
          <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-sm font-medium text-k-dark-grey mb-2">
              Uploaded Documents
            </p>
            <div className="space-y-2">
              {linkGroups.map((group) => (
                <div key={group.key}>
                  <p className="text-xs text-k-medium-grey mb-1">
                    {group.label}
                  </p>
                  <div className="space-y-1">
                    {group.urls.map((url) => (
                      <div key={url} className="text-sm">
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-k-orange hover:underline"
                        >
                          View
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isEditing && (
          <div className="flex justify-end gap-4 pt-4 border-t mt-6">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" icon={MdSave}>
              Save Changes
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
