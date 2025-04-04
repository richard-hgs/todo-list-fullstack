import moment from "moment";
import { splitNumChar } from "./regex";
import { DurationInputArg2 } from "moment/moment";

// TODO Pending documentation

export function getExpiry(duration: string) {
  const {num, char} = splitNumChar(duration);
  const createdAt = new Date();
  return moment(createdAt).add(num, char as DurationInputArg2).toDate();
}

export function isTokenExpired(expiry: Date): boolean {
  const expirationDate = new Date(expiry);
  const currentDate = new Date();
  return expirationDate.getTime() <= currentDate.getTime();
}