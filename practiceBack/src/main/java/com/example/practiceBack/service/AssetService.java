package com.example.practiceBack.service;

import com.example.practiceBack.dto.Asset;
import com.example.practiceBack.mapper.AssetMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssetService {

    private final AssetMapper assetMapper;

    public AssetService(AssetMapper assetMapper) {
        this.assetMapper = assetMapper;
    }

    public List<Asset> getAllAssets() {
        return assetMapper.findAll();
    }

    public void addAsset(Asset asset) {
        assetMapper.insertAsset(asset);
    }

    public void updateAsset(Asset asset) {
        assetMapper.updateAsset(asset);
    }

    public void deleteAsset(String assetSerialNumber) {
        assetMapper.deleteAsset(assetSerialNumber);
    }
}
