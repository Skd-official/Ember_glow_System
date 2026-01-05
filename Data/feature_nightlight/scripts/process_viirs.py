"""
处理裁剪后的VIIRS数据，生成API格式JSON
使用方法：python scripts/process_viirs.py
"""

import rasterio
import numpy as np
import json
from pathlib import Path

def process_viirs(input_tif, year):
    """处理单个年份的VIIRS数据"""
    print(f"处理 {year} 年数据...")
    
    with rasterio.open(input_tif) as src:
        data = src.read(1).astype(np.float32)
    
    data_valid = data[data > 0]
    
    stats = {
        'year': year,
        'avg_radiance': float(np.mean(data_valid)),
        'max_radiance': float(np.max(data_valid)),
        'min_radiance': float(np.min(data_valid[data_valid > 0])),
        'std_radiance': float(np.std(data_valid)),
        'lit_pixel_count': int(np.sum(data > 0)),
        'total_pixel_count': int(data.size),
        'lit_area_ratio': float(np.sum(data > 0) / data.size)
    }
    
    print(f"  平均亮度: {stats['avg_radiance']:.2f}")
    print(f"  最大亮度: {stats['max_radiance']:.2f}")
    print(f"  点亮比例: {stats['lit_area_ratio']*100:.1f}%")
    
    return stats

if __name__ == '__main__':
    BASE_DIR = Path(__file__).parent.parent
    RAW_DIR = BASE_DIR / "backend" / "data" / "nightlight" / "raw"
    STATS_DIR = BASE_DIR / "backend" / "data" / "nightlight" / "stats"
    
    STATS_DIR.mkdir(parents=True, exist_ok=True)
    
    # 处理各年份
    results = {}
    years = [2015, 2020, 2024]
    
    for year in years:
        filename = RAW_DIR / f'VIIRS_China_{year}_Annual.tif'
        if filename.exists():
            results[year] = process_viirs(str(filename), year)
        else:
            print(f"⚠ 找不到 {filename.name}")
    
    if len(results) >= 2:
        # 计算变化率（使用最早和最晚年份）
        available_years = sorted(results.keys())
        first_year, last_year = available_years[0], available_years[-1]
        
        change_rate = (results[last_year]['avg_radiance'] - 
                       results[first_year]['avg_radiance']) / results[first_year]['avg_radiance']
        
        api_response = {
            'years_data': [results[y] for y in available_years],
            'overall_change': {
                'change_rate': round(change_rate, 3),
                'trend': 'rising' if change_rate > 0 else 'declining',
                'period': f"{first_year}-{last_year}"
            }
        }
        
        output_file = STATS_DIR / 'nightlight_trend.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(api_response, f, indent=2, ensure_ascii=False)
        
        print(f"\n✓ 处理完成！已保存: {output_file}")
        print(f"{first_year}-{last_year}变化: {change_rate*100:+.1f}%")
    else:
        print("\n⚠ 数据不足，至少需要2个年份的数据")
