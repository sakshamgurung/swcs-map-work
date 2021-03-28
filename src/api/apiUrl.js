export class CompanyUrl{
    post = () => `/companies`;
    getAll = (type) => `/companies/${type}`;
    getById = (type, id) => `/companies/${type}/${id}`;
    getByRef = (type, ref, id) => `/companies/${type}/${ref}/${id}`;
    put = (type, id) => `/companies/${type}/${id}`;
    delete = (id) => `/companies/${id}`;
}

export class GeoObjectUrl{
    post = (type) => `/companies/geo-objects/${type}`;
    getAll = (id, type) => `/companies/${id}/geo-objects/${type}`;
    getById = (id, type) => `/geo-objects/${type}/${id}`;
    getByRef = (type, ref, id) => `/geo-objects/${type}/${ref}/${id}`;
    put = (type, id) => `/geo-objects/${type}/${id}`;
    delete = (type, id) => `/geo-objects/${type}/${id}`;
}

export class WorkUrl{
    post = () => `/companies/works`;
    getAll = (role, id) => `/${role}/${id}/works`;
    getById = (id) => `/works/${id}`;
    getByRef = (ref, id) => `/works/${ref}/${id}`;
    put = (id) => `/wokrs/${id}`;
    delete = (id) => `/works/${id}`;
}

export class StaffGroupUrl{
    post = () => `/companies/staff-group`;
    getAll = (id) => `/companies/${id}/staff-group`;
    getById = (id) => `/staff-group/${id}`;
    getByRef = (ref, id) => `/staff-group/${ref}/${id}`;
    put = (id) => `/staff-group/${id}`;
    delete = (id) => `/staff-group/${id}`;
}

export class VehicleUrl{
    post = () => `/companies/vehicles`;
    getAll = (id) => `/companies/${id}/vehicles`;
    getById = (id) => `/vehicles/${id}`;
    getByRef = (ref, id) => `/vehicles/${ref}/${id}`;
    put = (id) => `/vehicles/${id}`;
    delete = (id) => `/vehicles/${id}`;
}

export class WasteDumpUrl{
    post = () => `/customers/waste-dump`;
    getAll = (ref, id) => `/${ref}/${id}/waste-dump`;
    getById = (id) => `/waste-dump/${id}`;
    getByRef = (ref, id) => `/waste-dump/${ref}/${id}`;
    put = (id) => `/waste-dump/${id}`;
    delete = (id) => `/waste-dump/${id}`;
}