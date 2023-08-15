import { IUserContacts } from "../../interfaces/IUserContact";
import { IUserContactsPre } from "../../interfaces/IUserContactsPre";
import { api } from "../api";



export const contactsApi  = api.injectEndpoints({
    endpoints: (builder) => ({
        getContacts: builder.query<IUserContacts[], void>({
            query: () => "/contact",
            providesTags: ["Contact"]
        }),

        deleteContact: builder.mutation<IUserContacts, string>({
            query: (id: string)=> ({
                url: `/contact/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Contact"]
        }),

        addContact: builder.mutation<IUserContacts, IUserContactsPre>({
            query: (body: IUserContactsPre)=> ({
                url: `/contact`,
                method: "POST",
                body
            }),
            invalidatesTags: ["Contact"]
        }),


        editContact: builder.mutation<IUserContacts, IUserContacts>({
            query: (data: IUserContacts) => {
                const {id, ...body} = data;
                return {
                    url: `/contact/${id}`,
                    method: "PUT",
                    body
                }
            },
            invalidatesTags: ["Contact"]
        }),

    }),
})

export const { 
    useGetContactsQuery,
    useDeleteContactMutation,
    useAddContactMutation,
    useEditContactMutation
    } = contactsApi;