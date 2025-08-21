import EmptyCardImg from "../assets/EmptyCardImg.svg"; 
import NoSearchDataImg from "../assets/NoSearchDataImg.svg"; 
import NoFilterDataImg from "../assets/NoFilterDataImg.svg"; 

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getInitials = (name) => {
  if (!name)
    return "";
  const words = name.split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++)
    initials += words[i][0];

  return initials.toUpperCase();
};

export const getEmptyCardMessage = (filterType) => {
  switch (filterType) {
    case "search":
      return `Oops! No Story found matching your search.`;
    case "date":
      return `Oops! No Story found in the given date range.`;
    default:
      return `Create Your First Travel Story! Click on 'Add' to jot down your thoughts, memories and experiences`;
  }
};

export const getEmptyCardImg = (filterType) => {
  switch (filterType) {
    case "search":
      return NoSearchDataImg;
    case "date":
      return NoFilterDataImg;
    default:
      return EmptyCardImg;
  }
};
