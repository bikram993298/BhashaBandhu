import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api";

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const { data: authUserData } = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,
  });

  const authUser = authUserData?.user;

  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [nativeLanguage, setNativeLanguage] = useState("");
  const [learningLanguage, setLearningLanguage] = useState("");
  const [location, setLocation] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (authUser) {
      setFullName(authUser.fullName || "");
      setBio(authUser.bio || "");
      setNativeLanguage(authUser.nativeLanguage || "");
      setLearningLanguage(authUser.learningLanguage || "");
      setLocation(authUser.location || "");
      setPreview(authUser.profilePic || "");
    }
  }, [authUser]);

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("bio", bio);
    formData.append("nativeLanguage", nativeLanguage);
    formData.append("learningLanguage", learningLanguage);
    formData.append("location", location);
    if (profilePic) formData.append("profilePic", profilePic);

    try {
      const res = await axios.put("/api/profile", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Update React Query cache instead of setAuthUser
      queryClient.setQueryData(["authUser"], { user: res.data });

      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col items-center">
          <img
            src={preview || "/default-avatar.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover mb-2"
          />
          <input type="file" onChange={handleFileChange} />
        </div>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full Name"
          className="p-2 border rounded"
        />
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Bio"
          className="p-2 border rounded"
        />
        <input
          type="text"
          value={nativeLanguage}
          onChange={(e) => setNativeLanguage(e.target.value)}
          placeholder="Native Language"
          className="p-2 border rounded"
        />
        <input
          type="text"
          value={learningLanguage}
          onChange={(e) => setLearningLanguage(e.target.value)}
          placeholder="Learning Language"
          className="p-2 border rounded"
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="p-2 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Save
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
