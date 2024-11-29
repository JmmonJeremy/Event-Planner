// handlebars helper functions
import moment from 'moment';

interface User {
  _id: { toString: () => string };
}

export const formatDate = (date: string | Date, format: string): string => {
  return moment(date).utc().format(format);
};

export const truncate = (str: string, len: number): string => {
  if (str.length > len && str.length > 0) {
    let new_str = str + ' '
    new_str = str.substr(0, len)
    new_str = str.substr(0, new_str.lastIndexOf(' '))
    new_str = new_str.length > 0 ? new_str : str.substr(0, len)
    return new_str + '...'
  }
  return str
};

export const stripTags = (input: string): string => {
  return input.replace(/<(?:.|\n)*?>/gm, '')
};

export const editIcon = (
  creationGoalUser: User,
  loggedUser: User,
  creationGoalId: string,
  floating: boolean = true
): string => {
  if (creationGoalUser._id.toString() == loggedUser._id.toString()) {
    if (floating) {        
      return `<a href="/creationGoals/edit/${creationGoalId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
    } else {
      return `<a href="/creationGoals/edit/${creationGoalId}"><i class="fas fa-edit"></i></a>`
    }
  } else {
    return ''
  }
};

export const select = (selected: string, options: { fn: (context: any) => string }): string => {
  return options
    .fn(this)
    .replace(
      new RegExp(' value="' + selected + '"'),
      '$& selected="selected"'
    )
    .replace(
      new RegExp('>' + selected + '</option>'),
      ' selected="selected"$&'
    )
};

export const getMonth = (date: string | Date): number => {
  const dateMonth= new Date(date).getMonth() + 1;
  return dateMonth;
};

export const getDay = (date: string | Date): number => {
  const dateDay= new Date(date).getDate();
  return dateDay;
};
 
export const getYear = (date: string | Date): number => {
  // If no parapmeter detect by ensuring the date is a valid Date object
  const validDate = new Date(date);
  if (isNaN(validDate.getTime())) {
    // Return current year if the date is invalid
    return new Date().getFullYear();
  }  
  // Otherwise, return the year from the valid date
  const dateYear = validDate.getFullYear();
  return dateYear;
};

export const goBack = (req: { get: (header: string) => string | undefined }): string => {
  return req.get('Referer') || '/creationGoals'; // Fallback URL if Referer is not available
};

export const log = (id: string, title: string, user: string): string => {
  // Define a maximum length for the title column
  const maxTitleLength = 30;
    // Truncate title if it's too long
  if (title.length > maxTitleLength) {
    // Truncate and add "..." at the end (3 chars for ellipsis)
    title = title.substr(0, maxTitleLength - 3) + '...';
  }
  // Pad title if it's too short
  title = title.padEnd(maxTitleLength, ' ');
  console.log(`${id} |-> "${title}" |-> ${user}`);
  return "";
}
