import { writable } from 'svelte/store'
import type { Company, NewCompany } from '$lib/types/company'
import {
    fetchCompanies,
    addCompany,
    deleteCompany,
    getCompany,
    getCompanyByUserID,
    fetchUserCompanies,
    testNeo4j,
    testPost,
} from '$lib/services/companyService'
import { getFromLocalStorage, saveToLocalStorage } from '$lib/utils'

// Clé utilisée pour stocker l'ID de l'entreprise sélectionnée dans le localStorage
const SELECTED_COMPANY_KEY = 'selectedCompanyId'

function createCompanyStore() {
    const { subscribe, set, update } = writable<Company[]>([])
    // Store pour suivre l'entreprise sélectionnée

    return {
        subscribe,
        set,
        update,
        // Store pour l'entreprise sélectionnée
        fetch: async () => {
            const companies = await fetchCompanies()
            set(companies || [])
        },
        fetchByUserID: async (id: number) => {
            const company = await getCompanyByUserID(id)
            return company
        },
        add: async (company: NewCompany) => {
            const newCompany = await addCompany(company)
            companies.fetch()
            return newCompany
        },
        delete: async (id: number) => {
            await deleteCompany(id)
            companies.fetch()
        },
        get: async (id: number) => {
            return await getCompany(id)
        },
        testGet: async () => {
            const companies = await testNeo4j()
            return companies
        },
        testPost: async () => {
            const company = await testPost()
            return company
        },
    }
}

export const companies = createCompanyStore()

function createUserCompanyStore() {
    const { subscribe, set, update } = writable<Company[]>([])

    const selectedCompanyId = writable<number | null>(
        getFromLocalStorage(SELECTED_COMPANY_KEY)
            ? parseInt(getFromLocalStorage(SELECTED_COMPANY_KEY) as string)
            : null
    )
    return {
        subscribe,
        set,
        update,
        selected: {
            subscribe: selectedCompanyId.subscribe,
            // Sélectionner une entreprise par son ID
            select: (id: number) => {
                selectedCompanyId.set(id)
                saveToLocalStorage(SELECTED_COMPANY_KEY, id.toString())
            },
            // Désélectionner l'entreprise actuelle
            clear: () => {
                selectedCompanyId.set(null)
                saveToLocalStorage(SELECTED_COMPANY_KEY, null)
            },
            // Récupérer l'ID de l'entreprise sélectionnée
            get: () => {
                return getFromLocalStorage(SELECTED_COMPANY_KEY)
                    ? parseInt(
                          getFromLocalStorage(SELECTED_COMPANY_KEY) as string
                      )
                    : null
            },
        },
        fetch: async () => {
            const companies = await fetchUserCompanies()
            set(companies || [])
        },
        add: async (company: NewCompany) => {
            const newCompany = await addCompany(company)
            userCompanies.fetch()
            return newCompany
        },
    }
}

export const userCompanies = createUserCompanyStore()
