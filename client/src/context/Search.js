import {useState , useContext , createContext} from 'react';
/*

    useContext is a React hook that provides a way to share data (context) across multiple components without 
    explicitly passing it through props. i.e setting a global variable

*/

const SearchContext = createContext();

const SearchProvider = ({children}) => {

    const [auth,setAuth] = useState({
        keyword: "",
        results: [],
    });


    
    return (
        <SearchContext.Provider value={[auth , setAuth]}>         {/* Wrapping the chilren with the context Provider to let "auth" share among all the components whoever imports this useAuth */}
            {children}
        </SearchContext.Provider>
    );
};

// custom hook
const useSearch = () => useContext(SearchContext);

export {useSearch , SearchProvider};