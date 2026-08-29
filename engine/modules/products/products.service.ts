import { productsRepository } from "./products.repository"; 

export const productsService = {
  async search(search:string, companyId?: string, greater = '>') {
    return productsRepository.search(search, companyId, greater);
  },
  async addCategory(data: { name: string; company_id?: string }) {
    return productsRepository.addCategory({
      name: data.name, company_id: data.company_id
    });
  },
  async addUnit(data: { name: string; company_id?: string }) {
    return productsRepository.addUnit({
      name: data.name, company_id: data.company_id
    });
  },

  async getCategories(company_id?: string) {   
    return productsRepository.getCategories(company_id);
  },

  async getUnits(company_id?: string) {   
    return productsRepository.getUnits(company_id);
  },

  async addDefinition(data: {company_id?:string, user_id:number, form:any}) { 
    return productsRepository.addDefinition(data);
  },
  async getDefinitions(company_id?: string, page:number=1, limit:number=10, q:string="") {   
    return productsRepository.getDefinitions(company_id, page, limit, q );
  },
  async getSuppliers(company_id?: string) {   
    return productsRepository.getSuppliers(company_id);
  },
   


   


};

