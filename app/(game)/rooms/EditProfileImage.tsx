import { useTranslations } from "next-intl";

const EditProfileImage = () => {
  const m = useTranslations("MatchSettingForm");

  return (
    <div>
      <p className="text-center py-2 mb-8">coming soon...</p>
      <button
        id="back"
        className="w-full bg-match-button font-bold text-white py-2 rounded text-xl disabled:bg-gray-200"
      >
        {m("close")}
      </button>
    </div>
  );
};

export default EditProfileImage;
