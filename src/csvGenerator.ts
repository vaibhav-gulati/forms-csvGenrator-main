interface JSONData {
    [key: string]: any;
  }
  
  interface CSVObject {
    [key: string]: {
      schema: string;
      label: string;
      value: any;
    };
  }
  
  function fetchKeys(jsonData: JSONData, keys: string[]): JSONData {
    const result: JSONData = {};
    keys.forEach((key) => {
      if (key in jsonData) {
        result[key] = jsonData[key];
      }
    });
    return result;
  }
  
  export function generateCSVObject(jsonData: JSONData, keysToFetch: string[]): CSVObject {

    let schemaval="";
    const fetchedData = fetchKeys(jsonData, keysToFetch);
  
    const { group, ...obj1 } = fetchedData.schema;
    const { questionnaire, ...obj2 } = fetchedData.data;
  
    let csvobj: CSVObject = {};
  
    for (let key in obj2) {
      let schema = '';
      let label = '';
      let value = obj2[key];
  
      if (typeof value === 'object' && value !== null) {
        if (value.hasOwnProperty('Yes')) {
          value = value.Yes ? 'Yes' : 'No';
        }
        if (value.hasOwnProperty(value)) {
          value = value[value];
        }
      }
  
      for (let parent in obj1) {
        if (obj1[parent].elements && obj1[parent].elements[key]) {
          schemaval = parent
          schema = parent;
          label = obj1[parent].elements[key].label;
          break;
        }
      }
  
      csvobj[key] = {
        schema: schema,
        label: label,
        value: value,
      };
    }


  

    csvobj["resource_id"]={
      schema: schemaval,
      label: "resource_id",
      value: jsonData.resource._id,
    };
    csvobj["resource_name"]={
      schema: schemaval,
      label: "resource_name",
      value: jsonData.resource.name,
    };
    csvobj["frm_not_riyo_id"]={
      schema: schemaval,
      label: "frm_not_riyo_id",
      value: jsonData.frm_not_riyo_id,
    };
    csvobj["frm_reference"]={
      schema: schemaval,
      label: "frm_reference",
      value: jsonData.frm_reference,
    };
  
    for (let parent in obj1) {
      for (let key in obj1[parent].elements) {
        if (!csvobj.hasOwnProperty(key)) {
          csvobj[key] = {
            schema: parent,
            label: obj1[parent].elements[key].label,
            value: '',
          };
        }
      }
    }


  
    return csvobj;
  }