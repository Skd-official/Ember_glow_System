"""
裁剪全球VIIRS夜光数据 - 提取中国区域
使用方法：python scripts/clip_china.py
"""

import rasterio
from rasterio.windows import from_bounds
import numpy as np
from pathlib import Path

# 中国边界范围 (经纬度)
CHINA_BOUNDS = {
    'west': 73.0,
    'east': 135.0,
    'south': 18.0,
    'north': 53.0
}

def clip_to_china(input_path, output_path):
    """裁剪全球数据到中国范围"""
    
    print(f"读取文件: {input_path}")
    
    with rasterio.open(input_path) as src:
        window = from_bounds(
            CHINA_BOUNDS['west'],
            CHINA_BOUNDS['south'],
            CHINA_BOUNDS['east'],
            CHINA_BOUNDS['north'],
            src.transform
        )
        
        print("裁剪中国区域...")
        data = src.read(1, window=window)
        transform = src.window_transform(window)
        
        meta = src.meta.copy()
        meta.update({
            'height': data.shape[0],
            'width': data.shape[1],
            'transform': transform,
            'compress': 'lzw'
        })
        
        print(f"保存到: {output_path}")
        with rasterio.open(output_path, 'w', **meta) as dst:
            dst.write(data, 1)
        
        valid_data = data[data > 0]
        print(f"\n✓ 裁剪完成!")
        print(f"  输出尺寸: {data.shape[1]} x {data.shape[0]} 像素")
        print(f"  有效像素: {len(valid_data):,} 个")
        print(f"  平均亮度: {np.mean(valid_data):.2f}")
        print(f"  最大亮度: {np.max(valid_data):.2f}")
        print(f"  文件大小: {Path(output_path).stat().st_size / 1024 / 1024:.1f} MB")

if __name__ == '__main__':
    # 路径配置（相对于项目根目录 feature_nightlight）
    BASE_DIR = Path(__file__).parent.parent  # feature_nightlight 目录
    INPUT_DIR = BASE_DIR / "Data"
    OUTPUT_DIR = BASE_DIR / "backend" / "data" / "nightlight" / "raw"
    
    # 要处理的文件列表
    FILES = {
        "VNL_v21_npp_2015_global_vcmslcfg_c202205302300.average_masked.dat.tif": "VIIRS_China_2015_Annual.tif",
        "VNL_v21_npp_2020_global_vcmslcfg_c202205302300.average_masked.dat.tif": "VIIRS_China_2020_Annual.tif",
        "VNL_npp_2024_global_vcmslcfg_v2_c202502261200.average_masked.dat.tif": "VIIRS_China_2024_Annual.tif",
    }
    
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    for input_name, output_name in FILES.items():
        input_path = INPUT_DIR / input_name
        output_path = OUTPUT_DIR / output_name
        
        if input_path.exists():
            print(f"\n{'='*50}")
            clip_to_china(str(input_path), str(output_path))
        else:
            print(f"\n⚠ 跳过: 找不到 {input_name}")
    
    print(f"\n{'='*50}")
    print("全部完成！输出目录:", OUTPUT_DIR)
