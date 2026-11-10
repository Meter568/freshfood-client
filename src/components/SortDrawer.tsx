import { MinusIcon, SlidersHorizontalIcon } from "lucide-react"
import { Box, Slider } from "@mui/material";
import type { SortDrawerProps } from "../types/sort";

const SortDrawer = ({ trademarks, countries, selectedBrands, selectedCountries, minPrice, maxPrice, isFiltered, sortOrder, onChangeSortOrder, onChangeBrand, onChangeCountry, onApply, onReset, rangeMin, rangeMax, range, handleSliderChange, handleInputChange }: SortDrawerProps) => {
    const inputId = "sort-drawer-toggle"
    return (
        <div className="drawer">
            <input id={inputId} type="checkbox" className="drawer-toggle" />
            <div className="drawer-content mb-3 flex items-center justify-between gap-3">
                <div>
                    <label htmlFor={inputId} className="btn btn-soft btn-primary hover:text-white drawer-button"><SlidersHorizontalIcon /> Фільтри</label>
                    {isFiltered && (
                        <button onClick={onReset} className="btn btn-ghost">Скинути</button>
                    )}
                </div>
                <select
                    className="select select-bordered w-22 select-sm"
                    value={sortOrder}
                    onChange={(e) => onChangeSortOrder(e.target.value as 'new' | 'old')}
                >
                    <option value="new">Нові</option>
                    <option value="old">Старі</option>
                </select>
            </div>
            <div className="drawer-side z-50">
                <label htmlFor={inputId} aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="min-h-full w-80 bg-base-100 p-4 space-y-2">
                    <div className="collapse collapse-arrow border border-gray-100">
                        <input type="checkbox" />
                        <div className="collapse-title font-semibold">Торгова марка</div>
                        <div className="collapse-content text-sm max-h-64 flex flex-col gap-3 overflow-auto">
                            {trademarks.map(trademark => (
                                <label key={trademark.id} className="flex items-center gap-2">
                                    <input type="checkbox" className="checkbox checkbox-sm" checked={selectedBrands.includes(trademark.id)} onChange={e => onChangeBrand(trademark.id, e.target.checked)} />
                                    {trademark.name}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="collapse collapse-arrow border border-gray-100">
                        <input type="checkbox" />
                        <div className="collapse-title font-semibold">Країна</div>
                        <div className="collapse-content text-sm max-h-64 flex flex-col gap-3 overflow-auto">
                            {countries.map(country => (
                                <label key={country.id} className="flex items-center gap-2">
                                    <input type="checkbox" className="checkbox checkbox-sm" checked={selectedCountries.includes(country.id)} onChange={e => onChangeCountry(country.id, e.target.checked)} />
                                    {country.name}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="collapse collapse-arrow border border-gray-100">
                        <input type="checkbox" />
                        <div className="collapse-title font-semibold">Ціна</div>
                        <div className="collapse-content text-sm">
                            <div className="flex justify-between items-center gap-2 w-full">
                                <input
                                    type="number"
                                    placeholder="Від"
                                    className="input input-bordered input-sm w-24"
                                    value={minPrice ?? ""}
                                    onChange={(e) => handleInputChange(0, e.target.value)}
                                />
                                <span><MinusIcon /></span>
                                <input
                                    type="number"
                                    placeholder="До"
                                    className="input input-bordered input-sm w-24"
                                    value={maxPrice ?? ""}
                                    onChange={(e) => handleInputChange(1, e.target.value)}
                                />
                            </div>
                            <Box sx={{ width: '100%', mt:5, px: 2 }}>
                                <Slider 
                                    getAriaLabel={() => 'Price range'}
                                    value={range}
                                    onChange={handleSliderChange}
                                    valueLabelDisplay="auto"
                                    min={rangeMin}
                                    max={rangeMax}
                                    sx={{
                                        color: "4fbf8b",
                                        '& .MuiSlider-thumb': {
                                            width: 16,
                                            height: 16,
                                            bgcolor: '#4fbf8b',
                                            border: "1px solid #4fbf8b",
                                            "&:hover": { boxShadow: "0 0 0 8px rgba(68, 174, 124, 0.16)" },
                                        },
                                        '& .MuiSlider-track': {
                                            bgcolor: '#4fbf8b',
                                        },
                                        '& .MuiSlider-rail': {
                                            opacity: 1,
                                            bgcolor: '#4fbf8b',
                                        },
                                    }}
                                />
                            </Box>
                        </div>
                    </div>
                    <div className="pt-2">
                        <label htmlFor={inputId} className="btn btn-primary w-full text-white" onClick={onApply}>Показати результат</label>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SortDrawer
