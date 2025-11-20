package com.example.practiceBack.service;

import com.example.practiceBack.dto.Asset;
import com.example.practiceBack.mapper.AssetMapper;
import com.example.practiceBack.mapper.DeviceMapper;
import com.example.practiceBack.mapper.LogMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssetService {

    private final AssetMapper assetMapper;
    private final LogMapper logMapper;
    private final DeviceMapper deviceMapper;

    public AssetService(AssetMapper assetMapper, LogMapper logMapper, DeviceMapper deviceMapper) {
        this.assetMapper = assetMapper;
        this.logMapper = logMapper;
        this.deviceMapper = deviceMapper;
    }

    public List<Asset> getAllAssets() {
        return assetMapper.findAll();
    }

    public Asset getAsset(String assetSerialNumber) {
        return assetMapper.findBySerialNumber(assetSerialNumber);
    }

    public void addAsset(Asset asset) {
        assetMapper.insertAsset(asset);
        int catId = deviceMapper.findCatIdBySerialNumber(asset.getDeviceSerialNumber());
        if (catId == 2 ) {
            logMapper.insertLog(asset.getAssetSerialNumber());
        }
    }

    public void updateAsset(Asset asset) {
        assetMapper.updateAsset(asset);
    }

    public void deleteAsset(String assetSerialNumber) {
        assetMapper.deleteAsset(assetSerialNumber);
    }
}
