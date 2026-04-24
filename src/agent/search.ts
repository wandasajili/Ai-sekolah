import schoolProfile from "../../database/school_profile.json";

export class SearchAgent {
  getProfile() {
    return schoolProfile;
  }

  searchFacilities(query: string) {
    return schoolProfile.facilities.filter(f => 
      f.toLowerCase().includes(query.toLowerCase())
    );
  }

  getDepartmentInfo(id: string) {
    return schoolProfile.departments.find(d => d.id === id);
  }
}
