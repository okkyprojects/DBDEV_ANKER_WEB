<?php

namespace App\Support;

class StockChangeContext
{
    private static ?string $action = null;

    public static function set(string $action): void
    {
        static::$action = $action;
    }

    public static function get(): ?string
    {
        return static::$action;
    }

    public static function clear(): void
    {
        static::$action = null;
    }
}
