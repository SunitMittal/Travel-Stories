import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import TravelStoryCard from "../components/TravelStoryCard";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import AddEditTravelStory from "./AddEditTravelStory";
import ViewTravelStory from "./ViewTravelStory";
import EmptyCard from "../components/EmptyCard";
import { DayPicker } from "react-day-picker";
import moment from "moment";
import FilterInfoTitle from "../components/FilterInfoTitle";
import { getEmptyCardImg, getEmptyCardMessage } from "../utils/helper";

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [dateRange, setDateRange] = useState({ form: null, to: null });
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  });

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) setUserInfo(response.data.user);
    } catch (err) {
      if (err.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get("/get-all-story");
      if (response.data && response.data.stories)
        setAllStories(response.data.stories);
    } catch (err) {
      console.log("An Unexpected Error occur. Please try again");
    }
  };

  const handleEdit = async (data) => {
    setOpenAddEditModal({ isShown: true, type: "edit", data: data });
  };

  const handleViewStory = async (data) => {
    setOpenViewModal({ isShown: true, data });
  };

  const updateIsFavourite = async (storyData) => {
    const storyID = storyData._id;
    try {
      const response = await axiosInstance.put(
        "/update-is-favourite/" + storyID,
        {
          isFavourite: !storyData.isFavourite,
        }
      );
      if (response.data && response.data.story) {
        toast.success("Story Updated Successfully");

        if(filterType === 'search' && searchQuery)
          onSearchStory(searchQuery)
        else if(filterType === 'date')
          filterStoriesByDate(dateRange)
        else
          getAllTravelStories();
      }
    } catch (err) {
      console.log("An Unexpected Error occur. Please try again");
    }
  };

  const deleteTravelStory = async (data) => {
    const storyID = data._id;
    try {
      const response = await axiosInstance.delete("/delete-story/" + storyID);
      if (response.data && !response.data.error) {
        toast.error("Story Deleted Successfully");
        setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
        getAllTravelStories();
      }
    } catch (err) {
      console.log("An Unexpected Error occur. Please try again");
    }
  };

  const onSearchStory = async (query) => {
    try {
      const response = await axiosInstance.get("/search", {
        params: {
          query,
        },
      });
      if (response.data && (response.data.stories || response.data.story)) {
        setFilterType("search");
        setAllStories(response.data.stories || response.data.story);
      }
    } catch (err) {
      console.log("An Unexpected Error occur. Please try again");
    }
  };

  const handleClearSearch = () => {
    setFilterType("");
    getAllTravelStories();
  };

  const filterStoriesByDate = async (day) => {
    try {
      const startDate = day.from ? moment(day.from).valueOf() : null;
      const endDate = day.to ? moment(day.to).valueOf() : null;

      if (startDate && endDate) {
        const response = await axiosInstance.get("/travel-stories/filter", {
          params: { startDate, endDate },
        });
        if (response.data && (response.data.stories || response.data.story)) {
          setFilterType("date");
          setAllStories(response.data.stories || response.data.story);
        }
      }
    } catch (err) {
      console.log("An Unexpected Error occur. Please try again");
    }
  };

  const handleDayClick = (day) => {
    setDateRange(day);
    filterStoriesByDate(day);
  };

  const resetFilter = () => {
    setDateRange({from:null, to:null});
    setFilterType('');
    getAllTravelStories()
  };

  useEffect(() => {
    getUserInfo();
    getAllTravelStories();
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchNote={onSearchStory}
        handleClearSearch={handleClearSearch}
      />
      <div className="container mx-auto py-7">
        <FilterInfoTitle
          filterType={filterType}
          filterDates={dateRange}
          onClear={() => {
            resetFilter();
          }}
        />
        <div className="flex gap-5">
          <div className="flex-1">
            {allStories.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {allStories.map((item) => {
                  return (
                    <TravelStoryCard
                      key={item._id}
                      imgUrl={item.imageUrl}
                      title={item.title}
                      story={item.story}
                      date={item.visitedDate}
                      visitedLocation={item.visitedLocations}
                      isFavourite={item.isFavourite}
                      onClick={() => handleViewStory(item)}
                      onFavouriteClick={() => updateIsFavourite(item)}
                    />
                  );
                })}
              </div>
            ) : (
              <EmptyCard
                imgSrc={getEmptyCardImg(filterType)}
                message={getEmptyCardMessage(filterType)}
              />
            )}
          </div>

          <div className="w-[350px]">
            <div className="bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg">
              <div className="p-3">
                <DayPicker
                  captionLayout="dropdown-buttons"
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDayClick}
                  pagedNavigation
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="modal-box scrollbar"
      >
        <AddEditTravelStory
          type={openAddEditModal.type}
          storyInfo={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllTravelStories={getAllTravelStories}
        />
      </Modal>
      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="modal-box scrollbar"
      >
        <ViewTravelStory
          storyInfo={openViewModal.data || null}
          onClose={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
          }}
          onEditClick={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
            handleEdit(openViewModal.data || null);
          }}
          onDeleteClick={() => {
            deleteTravelStory(openViewModal.data || null);
          }}
        />
      </Modal>
      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>
      <ToastContainer />;
    </>
  );
};

export default Home;
