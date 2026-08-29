import { coRepository } from "./company.repository"; 

export const coService = {
    

  async updateCompany(cid: number, data: { name: string; email: string }) {
       
    await coRepository.update(
      { name: data.name, email: data.email },
      "id = ?", [cid]
    );

    return await coRepository.find(cid);
  },

  
};
