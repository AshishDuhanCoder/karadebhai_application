import sys
import json
import base64
from io import BytesIO
from PIL import Image, ImageStat

def analyze_image(image_data, category):
    """
    Analyze image using PIL only - no numpy required
    Returns: dict with success, match status, and confidence
    """
    try:
        # Remove data URL prefix if present
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        # Decode base64 image
        image_bytes = base64.b64decode(image_data)
        image = Image.open(BytesIO(image_bytes))
        
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Get image dimensions
        width, height = image.size
        
        # Check if image is too small
        if width < 100 or height < 100:
            return {
                "success": False,
                "message": "Image is too small. Please upload a clearer image."
            }
        
        # Analyze image characteristics
        match_score = analyze_by_category(image, category)
        
        if match_score >= 0.7:
            status = "MATCH"
            message = f"Image appears to match the {category} category."
        elif match_score >= 0.4:
            status = "PARTIAL"
            message = f"Image might be related to {category}. Please verify."
        else:
            status = "NOMATCH"
            message = f"Image doesn't appear to match {category}. Please upload a relevant image."
        
        return {
            "success": True,
            "status": status,
            "message": message,
            "confidence": round(match_score * 100, 2)
        }
        
    except Exception as e:
        return {
            "success": False,
            "message": f"Error analyzing image: {str(e)}"
        }

def analyze_by_category(image, category):
    """
    Analyze image characteristics using PIL only
    Returns confidence score between 0 and 1
    """
    width, height = image.size
    
    # Get image statistics
    stat = ImageStat.Stat(image)
    
    # Mean brightness for each channel (R, G, B)
    mean_rgb = stat.mean
    mean_brightness = sum(mean_rgb) / 3
    
    # Standard deviation (measure of contrast)
    stddev_rgb = stat.stddev
    mean_stddev = sum(stddev_rgb) / 3
    
    # Category-specific analysis
    category_lower = category.lower()
    
    # Base score - all images start here
    score = 0.5
    
    if "pothole" in category_lower or "road" in category_lower:
        # Potholes: darker images with good contrast
        if mean_brightness < 120:
            score += 0.2
        if mean_stddev > 40:
            score += 0.2
        if width > height * 0.8:  # Usually horizontal
            score += 0.1
    
    elif "garbage" in category_lower or "litter" in category_lower:
        # Garbage: varied colors and contrast
        if mean_stddev > 35:
            score += 0.2
        color_diff = max(mean_rgb) - min(mean_rgb)
        if color_diff > 20:
            score += 0.2
        if 60 < mean_brightness < 180:
            score += 0.1
    
    elif "streetlight" in category_lower or "light" in category_lower:
        # Streetlights: often vertical, sky visible
        if height > width * 1.1:  # Vertical orientation
            score += 0.3
        if mean_brightness > 100:  # Sky visible
            score += 0.2
    
    elif "graffiti" in category_lower:
        # Graffiti: high color variation and contrast
        color_diff = max(mean_rgb) - min(mean_rgb)
        if color_diff > 25:
            score += 0.2
        if mean_stddev > 45:
            score += 0.2
        if 80 < mean_brightness < 160:
            score += 0.1
    
    elif "sidewalk" in category_lower or "pavement" in category_lower:
        # Sidewalk: medium brightness, ground level
        if 80 < mean_brightness < 150:
            score += 0.2
        if mean_stddev > 30:
            score += 0.2
        if width > height * 0.9:  # Usually horizontal
            score += 0.1
    
    else:
        # Other categories: just check if it's a valid image
        if 40 < mean_brightness < 200:
            score += 0.2
        if mean_stddev > 20:
            score += 0.2
    
    return min(score, 1.0)

if __name__ == "__main__":
    # Read input from command line arguments
    if len(sys.argv) != 3:
        print(json.dumps({
            "success": False,
            "message": "Invalid arguments"
        }))
        sys.exit(1)
    
    image_data = sys.argv[1]
    category = sys.argv[2]
    
    # Analyze image
    result = analyze_image(image_data, category)
    
    # Output result as JSON
    print(json.dumps(result))
