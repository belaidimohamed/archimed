import axios from "axios";

const apiURI = 'http://localhost:8000/api/';
const getHeader =  () => {
    return  {
      'Content-type': 'application/json',
      // did'nt add authorization since its not required
    }
} 

// ------------------------- Investors ---------------------------------

export async function createInvestor(payload) {
  return await axios.post(apiURI + "investor/", payload,getHeader());
};
export async function getInvestors() {
  return await axios.get(apiURI + "investor/",{headers:getHeader()});
};
export async function deleteInvestor(id) {
  return await axios.delete(apiURI + "investor/"+id,{headers:getHeader()});
};
export async function updateInvestor(id,data) {
  return await axios.patch(`${apiURI}investor/${id}/`,data,{headers:getHeader()});
};

// ------------------------- Bills ---------------------------------

export async function createBill(payload) {
  return await axios.post(apiURI + "bill/", payload, getHeader());
};

export async function getBills() {
  return await axios.get(apiURI + "bill/", { headers: getHeader() });
};

export async function deleteBill(id) {
  return await axios.delete(apiURI + "bill/" + id, { headers: getHeader() });
};

export async function updateBill(id, data) {
  return await axios.patch(`${apiURI}bill/${id}/`, data, { headers: getHeader() });
};


// ------------------------- capital calls ---------------------------------

export async function createCapitalCall(payload) {
  return await axios.post(apiURI + "capitalCall/", payload, getHeader());
};

export async function getCapitalCalls() {
  return await axios.get(apiURI + "capitalCall/", { headers: getHeader() });
};

export async function deleteCapitalCall(id) {
  return await axios.delete(apiURI + "capitalCall/" + id, { headers: getHeader() });
};

export async function updateCapitalCall(id, data) {
  return await axios.patch(`${apiURI}capitalCall/${id}/`, data, { headers: getHeader() });
};