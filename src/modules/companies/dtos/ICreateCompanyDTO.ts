export default interface ICreateCompanyDTO {
  name: string;
  email: string;
  password: string;
  company_type: 'MEI' | 'ME' | 'Startup';
}
