/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
    light: {
        text: '#11181C',
        background: '#fff',
        tint: tintColorLight,
        icon: '#687076',
        tabIconDefault: '#687076',
        tabIconSelected: tintColorLight,
    },
    dark: {
        text: '#ECEDEE',
        background: '#151718',
        tint: tintColorDark,
        icon: '#9BA1A6',
        tabIconDefault: '#9BA1A6',
        tabIconSelected: tintColorDark,
    },
    primary: '#2D5016',	// Forest Green 
    secondary: '#8FBC8F',	// Dark Sea Green 
    accent: '#CD853F',	// Peru (earthy tone) 
    background: '#F5F5DC',	// Beige
    surface: '#FFFFFF',	// White 
    text: {
        primary: '#1A1A1A',	// Almost Black 
        secondary: '#666666',		// Gray 
        accent: '#2D5016',	// Forest Green
    },
    status: {
        success: '#228B22',	// Forest Green 
        warning: '#FF8C00',	// Dark Orange 
        error: '#DC143C',	// Crimson 
        info: '#4682B4',	// Steel Blue
    },
    conservation: {
        'Least Concern': '#228B22',	// Green 
        'Near Threatened': '#FFD700',	// Gold 
        'Vulnerable': '#FF8C00',	// Orange 
        'Endangered': '#FF4500',	// Red Orange 
        'Critically Endangered': '#DC143C',
        'Extinct': '#696969', 
    }
};
