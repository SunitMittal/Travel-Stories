import React, { useState } from "react";
import { MdAdd, MdClose, MdDeleteOutline, MdUpdate } from "react-icons/md";
import DateSelector from "../components/DateSelector";
import ImageSelector from "../components/ImageSelector";
import TagInput from "../components/TagInput";
import axiosInstance from "../utils/axiosInstance";
import uploadImage from "../utils/uploadImage";
import moment from "moment";
import { toast } from "react-toastify";

const AddEditTravelStory = ({
  storyInfo,
  type,
  onClose,
  getAllTravelStories,
}) => {
  const [title, setTitle] = useState(storyInfo?.title || "");
  const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null);
  const [story, setStory] = useState(storyInfo?.story || "");
  const [visitedLocation, setVisitedLocation] = useState(
    storyInfo?.visitedLocations || []
  );
  const [visitedDate, setVisitedDate] = useState(
    storyInfo?.visitedDate || null
  );
  const [error, setError] = useState("");

  const addNewTravelStory = async () => {
    try {
      let imageUrl = "";
      if (storyImg) {
        const imgUploadRes = await uploadImage(storyImg);
        imageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post("/add-story", {
        title,
        story,
        visitedLocations: visitedLocation,
        imageUrl: imageUrl || "",
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
      });

      if (response.data && response.data.travelStory) {
        toast.success("Story Added Successfully");
        getAllTravelStories();
        onClose();
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message)
        setError(err.response.data.message);
      else setError("An unexpected error occurred. Please try again.");
    }
  };

  const updateTravelStory = async () => {
    try {
      let imageUrl = "";
      let postData = {
        title,
        story,
        visitedLocations: visitedLocation,
        imageUrl: storyImg ? (storyInfo.imageUrl || "") : "",
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
      };

      if (storyImg && typeof storyImg === "object") {
        const imgUploadRes = await uploadImage(storyImg);
        imageUrl = imgUploadRes.imageUrl || "";
        postData = { ...postData, imageUrl: imageUrl };
      }

      const response = await axiosInstance.put(
        "/update-story/" + storyInfo._id,
        postData
      );

      if (response.data && response.data.travelStory) {
        toast.success("Story Updated Successfully");
        getAllTravelStories();
        onClose();
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message)
        setError(err.response.data.message);
      else setError("An unexpected error occurred. Please try again.");
    }
  };

  const handleAddOrUpdateClick = () => {
    if (!title) {
      setError("Please enter the title");
      return;
    }
    if (!story) {
      setError("Please enter the story");
      return;
    }
    setError("");

    if (type === "edit") updateTravelStory();
    else addNewTravelStory();
  };

  const handleDeleteStoryImg = async () => {
    if (type === "edit" && storyInfo?.imageUrl) {
      try {
        const deleteImgRes = await axiosInstance.delete("/img-delete", {
          params: {
            imageUrl: storyInfo.imageUrl,
          },
        });

        if (deleteImgRes.data && deleteImgRes.data.success) {
          setStoryImg(null);
          toast.success("Image removed successfully");
        }
      } catch (err) {
        console.error("Error deleting image:", err);
        toast.error("Failed to delete image from server");
      }
    } else {
      setStoryImg(null);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <h5 className="text-xl font-medium text-slate-700">
          {type === "add" ? "Add Story" : "Update Story"}
        </h5>

        <div>
          <div className="flex items-center gap-3 p-2 rounded-l-lg">
            {type === "add" ? (
              <button
                className="btn-small cursor-pointer"
                onClick={handleAddOrUpdateClick}
              >
                <MdAdd className="text-lg" /> ADD STORY
              </button>
            ) : (
              <>
                <button
                  className="btn-small cursor-pointer"
                  onClick={handleAddOrUpdateClick}
                >
                  <MdUpdate className="text-lg" /> UPDATE STORY
                </button>
              </>
            )}

            <button className="cursor-pointer" onClick={onClose}>
              <MdClose className="text-xl text-slate-400" />
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-xs pt-2 text-right">{error}</p>
          )}
        </div>
      </div>

      <div>
        <div className="flex-1 flex flex-col gap-2 pt-4">
          <label className="input-label">TITLE</label>
          <input
            type="text"
            className="text-2xl text-slate-950 outline-none"
            placeholder="Your Title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />

          <div className="my-3">
            <DateSelector date={visitedDate} setDate={setVisitedDate} />
          </div>

          <ImageSelector
            image={storyImg}
            setImage={setStoryImg}
            handleDeleteImg={handleDeleteStoryImg}
          />

          <div className="flex flex-col gap-2 mt-4">
            <label className="input-label">STORY</label>
            <textarea
              type="text"
              className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
              placeholder="Your Story"
              rows={10}
              value={story}
              onChange={({ target }) => setStory(target.value)}
            />
          </div>
          <div className="pt-3">
            <label className="input-label">VISITED LOCATIONS</label>
            <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditTravelStory;
