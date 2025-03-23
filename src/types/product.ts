export type TProject = {
  _id: string;
  title: string,
  mainImg: string;
  details: string;
  shortDetails: string;
  image1: string;
  image2: string;
  image3: string;
  liveLink: string;
  githubServerLink: string;
  githubClientLink: string;
}
export type TService = {
  _id: string;
  num: string;
  title: string;
  description: string;

}
export type TSkill = {
  _id: string;
  name: string;
  img: string,
  ability: string
}
export type TEducation = {
  _id: string;
  institution: string,
  subject: string,
  degree: string,
  duration: string,
}
export interface TBlog {
  _id: string;
  title: string;
  blogImg: string;
  content: string;
  detail: string;
  author: string;
  authorPicture: string;
  isPublished: boolean;
  isDeleted: boolean;
}
export type TAbout = {
  _id: string;
  name: string;
  dateOfBirth: Date;
  address: string;
  email: string;
  details: string;
  contactNo: string
}
export interface TUser {
  _id: string; // MongoDB ObjectId
  name: string;
  address: string;
  phone: string;
  userImg: string;
  email: string;
  password: string; // Optional, since it may not be needed in every scenario
  role: "User" | "Admin"; // Restricting to specific roles
  isBlocked: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}



