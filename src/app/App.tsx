import { RouterProvider } from 'react-router-dom';
import { router } from '@/app/routes';

import { CssBaseline, InitColorSchemeScript } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import { theme } from '@/shared/theme';
import '@/shared/styles/globals.css';
import '@/shared/styles/lexical.css';

// 코드 하이라이팅
import Prism from 'prismjs';
if (typeof window !== 'undefined') window.Prism = Prism;
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markdown';

import { QueryClientProvider } from '@tanstack/react-query';
import { AlertProvider } from '@/app/providers/AlertProvider';
import { queryClient } from '@/shared/api/queryClient';


function App() {

    return (
        <>
            <InitColorSchemeScript
                attribute='data'
                defaultMode='system'
                modeStorageKey='bluecool-adm-color'
            />

            <ThemeProvider
                theme={theme}
                defaultMode='system'
                modeStorageKey='bluecool-adm-color'
                disableTransitionOnChange
                noSsr
            >
                <CssBaseline />
                <AlertProvider>
                    <QueryClientProvider client={queryClient}>
                        <RouterProvider router={router} />
                    </QueryClientProvider>
                </AlertProvider>
            </ThemeProvider>
        </>
    )
}

export default App
