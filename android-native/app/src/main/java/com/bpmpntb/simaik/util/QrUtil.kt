package com.bpmpntb.simaik.util

import android.graphics.Bitmap
import android.graphics.Color
import androidx.compose.foundation.Image
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.layout.ContentScale
import com.google.zxing.BarcodeFormat
import com.google.zxing.qrcode.QRCodeWriter

object QrUtil {
    fun generate(text: String, size: Int = 240): Bitmap? {
        return try {
            val matrix = QRCodeWriter().encode(text, BarcodeFormat.QR_CODE, size, size)
            val bmp = Bitmap.createBitmap(size, size, Bitmap.Config.RGB_565)
            for (x in 0 until size) for (y in 0 until size) {
                bmp.setPixel(x, y, if (matrix.get(x, y)) Color.BLACK else Color.WHITE)
            }
            bmp
        } catch (e: Exception) {
            null
        }
    }
}

@Composable
fun QrImage(text: String, modifier: Modifier = Modifier) {
    val bmp = remember(text) { QrUtil.generate(text) }
    bmp?.let {
        Image(
            bitmap = it.asImageBitmap(),
            contentDescription = "QR",
            contentScale = ContentScale.Fit,
            modifier = modifier
        )
    }
}
