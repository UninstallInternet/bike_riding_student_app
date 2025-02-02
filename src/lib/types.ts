export  interface FilterChangeEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & {
      name: 'sortByYear' | 'sortByRides' | 'sortByClass';
      checked: boolean;
      sortDirection?: 'asc' | 'desc';
    }
  }
  