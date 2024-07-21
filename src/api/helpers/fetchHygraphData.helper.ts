import axios from 'axios';
import { GQLResponse } from '../../core/interfaces/cms.interfaces';

const HYGRAPH_API_URL = "https://eu-central-1-shared-euc1-02.cdn.hygraph.com/content/clyt6dfps00u707w9s8qhb2jw/master"
const HYGRAPH_API_TOKEN = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE3MjE0NzU0MjksImF1ZCI6WyJodHRwczovL2FwaS1ldS1jZW50cmFsLTEtc2hhcmVkLWV1YzEtMDIuaHlncmFwaC5jb20vdjIvY2x5dDZkZnBzMDB1NzA3dzlzOHFoYjJqdy9tYXN0ZXIiLCJtYW5hZ2VtZW50LW5leHQuZ3JhcGhjbXMuY29tIl0sImlzcyI6Imh0dHBzOi8vbWFuYWdlbWVudC1ldS1jZW50cmFsLTEtc2hhcmVkLWV1YzEtMDIuaHlncmFwaC5jb20vIiwic3ViIjoiYmRjOTc3YTctYWVjZC00MmQ5LTgxMTktNDZkMDFhNTliMjRmIiwianRpIjoiY2x5dTIwdWpjMDZ5ZTA3dzZlOWR4ZGd3ZCJ9.3rwwMwmxZN6a-dItlvtpmKI09v1cni91cW5MCxDL9QcnF-4LsT7gWu2QMIxL7j8qG_XPtyHIB4O09OeXPWjZ9rcfyWXfdl_ve-tsK3PxAtWw9aDVIF3NeXhLUnnKDvirAGBJjZwxMPB37QP1Jag33O4v140eYHe4LMBCgWlKZWrcnD6CrZuQOht4I-_5iEGnFK1SWN3hg9w_LIbjReF-0fNImePIaV01kVIGqv6OCeq4AfJtvnxk-vTvfaEULdb7W9yqxIjYdiHORLwDIt1zXHPixEhFTWUo0F-RiOiPBavhd5JUasZSB6vlM2QUXvnngcdXQzTNNJjR-bu1o4Z6jriYAchj-5ktKo8X1fKykYtYoN5tknOTeQZ2XtKP9biFrnsQxYKpiDLljfnOlWYH3vzEst5EJaFloSpyPEq9RNe8SXz4BMqmARQAMTRHpxRmI0tTNzGMS5_Qsp4iCD4mOWHj9TPbA_pRJ-TBhoolUMSj3WEmtstb6DQj_ZPnNpeER_adl8PwOvaS62CBcbAlykxCKlZ3IBb7_-TVBW3Cy0hxxrg9PJvfBZasvhkfnMlqvSBaLj92xzRX4VhN6-3oLg2hicjIFU-xKxBPTVgLZ4l8y8zfC50xIjhTjWwil-j57YoVR5hZlg0XwnlOVOMmnzgbe4Jd33YWS3t02w26tn4";

export async function fetchHygraphData<T>(query: string, variables: Record<string, any> = {}): Promise<GQLResponse<T>> {
    try {
        const response = await axios.post(
            HYGRAPH_API_URL,
            {
                query,
                variables,
            },
            {
                headers: {
                    Authorization: `Bearer ${HYGRAPH_API_TOKEN}`,
                },
            }
        );

        return response.data;
    } catch (error: any) {
        throw new Error(`Hygraph API error: ${error.message}`);
    }
}