import type { CountryType } from "./country";
import type { TrademarkType } from "./trademark";

export type SortDrawerProps = {
    trademarks: TrademarkType[];
    countries: CountryType[];
    selectedBrands: number[];
    selectedCountries: number[];
    selectedParentCategoryIds?: (number | string)[];
    minPrice: number | null;
    maxPrice: number | null;
    isFiltered: boolean;
    sortOrder: 'new' | 'old';
    onChangeSortOrder: (order: 'new' | 'old') => void;
    onChangeBrand: (brandId: number, checked: boolean) => void;
    onChangeCountry: (countryId: number, checked: boolean) => void;
    onChangeParentCategory?: (id: number | string, checked: boolean) => void;
    onApply: () => void;
    onReset: () => void;
    rangeMin: number;
    rangeMax: number;
    range: number[];
    handleSliderChange: (_: Event, newValue: number | number[]) => void;
    handleInputChange: (index: number, value: string) => void;
}